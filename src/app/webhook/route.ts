import Stripe from "stripe";
import { headers } from 'next/headers'
import { TopicClient, TopicPublishResponse } from "@gomomento/sdk";
import { ensureCacheExists } from "../lib/cache";
import { EventTypes, NewTipEvent, NewTotalEvent } from "../utils/subscriptions";

const {
  NEXT_PUBLIC_MOMENTO_CACHE_NAME: MOMENTO_CACHE_NAME,
  NEXT_PUBLIC_MOMENTO_TOPIC_NAME: MOMENTO_TOPIC_NAME,
  STRIPE_SECRET_KEY,
  WEBHOOK_ENDPOINT_SECRET
} = process.env;

const stripe = new Stripe(STRIPE_SECRET_KEY!);
const endpointSecret = WEBHOOK_ENDPOINT_SECRET;

const momento = new TopicClient();

const totalTipped = 0;

export async function POST(request: Request) {
  await ensureCacheExists(MOMENTO_CACHE_NAME!);

  try {
    if (!stripe) { throw Error("Stripe not defined"); }

    const body = await request.text();
    let event;

    // secure webhook endpoint by verifying the event is from Stripe
    // @see https://docs.stripe.com/webhooks/signature
    if (endpointSecret && endpointSecret !== "") {
      const headersList = await headers();
      const signature = headersList.get("stripe-signature")!;

      event = stripe.webhooks.constructEvent(
        body,
        signature,
        endpointSecret
      );
    } else {
      event = JSON.parse(body);
    }

    switch(event.type) {
      case "payment_intent.succeeded":
        let piEvent = event as Stripe.PaymentIntentSucceededEvent
        console.log("PaymentIntent success ", piEvent.data.object.amount_received);
        const newTotalEvent : NewTotalEvent = {
          type: EventTypes.NEW_TOTAL,
          total: totalTipped + event.data.object.amount_received / 100,
        };
        await publishToTopic(JSON.stringify(newTotalEvent));
        break;
      case "checkout.session.completed":
        let csEvent = event as Stripe.CheckoutSessionCompletedEvent;
        console.log("Checkout session completed ", csEvent.data.object.amount_total);
        const tipperName = parseForTipperName(csEvent);
        const newTipEvent : NewTipEvent = {
          type: EventTypes.NEW_TIP,
          tipperName: tipperName,
          amount: event.data.object.amount_total / 100,
        }
        await publishToTopic(JSON.stringify(newTipEvent));
      default:
        // do nothing ... unhandled event
    }
  } catch (error) {
    let msg = error instanceof Error ? error.message : error;
    return new Response(`Webhook error: ${msg}`, { status: 400, });
  }
 
  return new Response('Success!', { status: 200, });
}

function parseForTipperName(event: Stripe.CheckoutSessionCompletedEvent) : string {
  const fields = event.data.object.custom_fields;
  
  let name = "Anonymous";
  let field = fields.find((field) => field.key === "name");
  
  if (field && field.text?.value) {
    name = field.text.value;
  }

  return name;
}

async function publishToTopic(value: string) {
  if (!MOMENTO_CACHE_NAME || !MOMENTO_TOPIC_NAME) {
    console.error("MOMENTO_CACHE_NAME or MOMENTO_TOPIC_NAME is not defined");
    return;
  }

  console.log(`Publishing cacheName=${MOMENTO_CACHE_NAME}, topicName=${MOMENTO_TOPIC_NAME}, value=${value}`);
  const publishResponse = await momento.publish(MOMENTO_CACHE_NAME, MOMENTO_TOPIC_NAME, value);
  switch (publishResponse.type) {
    case TopicPublishResponse.Success:
      console.log('Value published successfully!');
      break;
    case TopicPublishResponse.Error:
      console.log(`Error publishing value: ${publishResponse.toString()}`);
      break;
  }
}