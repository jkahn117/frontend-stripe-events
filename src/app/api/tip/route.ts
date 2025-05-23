import Stripe from "stripe";

const {
  DOMAIN,
  CUSTOMER_SETS_TIP_LOOK_UP_KEY,
  STRIPE_SECRET_KEY,
} = process.env;

let paymentLink: string | undefined = undefined;

/**
 * Handles GET requests to generate or return a Stripe payment link for tipping.
 * Caches the payment link after first creation.
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<Response>} A response containing the payment link URL or an error.
 */
export async function GET(request: Request) {
  if (!paymentLink) {
    try {
      paymentLink = await createPaymentLink();
    } catch (error) {
      console.error("Error creating payment link", error);
      return new Response("Error creating payment link", { status: 500 });
    }
  }

  return new Response(JSON.stringify({ url: paymentLink }));
};

/**
 * Initializes and returns a Stripe client instance.
 * @throws Will throw an error if the Stripe secret key is not defined.
 * @returns {Stripe} The Stripe client instance.
 */
function getStripe(): Stripe {
  let stripe = undefined;

  if (!STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not defined");
  }

  return stripe || new Stripe(STRIPE_SECRET_KEY);
}

/**
 * Creates a new Stripe price object for a tip.
 * @returns {Promise<string>} The ID of the created price object.
 */
async function createPrice(): Promise<string> {
  const stripe = getStripe();

  const price = await stripe.prices.create({
    custom_unit_amount: {
      enabled: true,
      preset: 1000,
      minimum: 100,
      maximum: 100000,
    },
    currency: "usd",
    product_data: {
      name: "Tip",
      metadata: {
        createdAt: new Date().toISOString(),
      }
    },
    lookup_key: CUSTOMER_SETS_TIP_LOOK_UP_KEY,
    transfer_lookup_key: true,
    metadata: {
      createdAt: new Date().toISOString(),
    }
  });

  return price.id;
}

/**
 * Finds an existing Stripe price by lookup key or creates a new one if not found.
 * @param {string} lookupKey - The lookup key for the price.
 * @returns {Promise<string>} The ID of the found or created price object.
 */
async function findOrCreatePrice(lookupKey: string): Promise<string> {
  const stripe = getStripe();

  const prices = await stripe.prices.list({
    lookup_keys: [ lookupKey ],
    active: true,
  });

  if (prices.data.length > 0) {
    return prices.data[0].id;
  }

  return await createPrice();
}

/**
 * Creates a Stripe payment link for tipping, including custom fields and redirect.
 * @returns {Promise<string>} The URL of the created payment link.
 */
async function createPaymentLink(): Promise<string> {
  const stripe = getStripe();

  return (await stripe.paymentLinks.create({
    custom_fields: [
      {
        key: "name",
        label: {
          custom: "Name",
          type: "custom",
        },
        type: "text",
      }
    ],
    line_items: [
      {
        price: await findOrCreatePrice(CUSTOMER_SETS_TIP_LOOK_UP_KEY!),
        quantity: 1,
      },
    ],
    after_completion: {
      type: "redirect",
      redirect: {
        url: `http://${DOMAIN}`,
      },
    },
    metadata: {
      createdAt: new Date().toISOString(),
    }
  })).url;
}