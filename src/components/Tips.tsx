"use client";

import { useEffect, useState } from "react";
import { type TopicItem, type TopicSubscribe } from "@gomomento/sdk-web";
import { clearTopicClient, EventTypes, NewTipEvent, NewTotalEvent, subscribeToTopic, type TipEvent } from "../utils/subscriptions";
import Button from "./Button";
import ProgressBar from "./ProgressBar";
import Scroller from "./Scroller";

export default function Tips() {
  const cacheName = String(process.env.NEXT_PUBLIC_MOMENTO_CACHE_NAME);
  const topicName = String(process.env.NEXT_PUBLIC_MOMENTO_TOPIC_NAME);

  const [ paymentLink, setPaymentLink ] = useState<string>("");
  const [ tippers, setTippers ] = useState<string[]>([]);
  const [ total, setTotal ] = useState<number>(0);

  useEffect(() => {
    const fetchPaymentLink = async () => {
      const response = await fetch("/api/tip");

      if (!response.ok) {
        throw new Error("Failed to fetch payment link");
      }
      
      const data = await response.json();
      setPaymentLink(data.url);
    };

    fetchPaymentLink();
  }, []);

  const onItem = (item: TopicItem) => {
    try {
      console.log("onItem", item);
      const message = JSON.parse(item.valueString());

      console.log(message.type === EventTypes.NEW_TOTAL);
      console.log(message.type);

      switch (message.type) {
        case EventTypes.NEW_TOTAL:
          const newTotalEvent = message as NewTotalEvent;
          console.log(`Total tipped: $${newTotalEvent.total}`);
          setTotal(newTotalEvent.total);
          break;
        case EventTypes.NEW_TIP:
          const newTipEvent = message as NewTipEvent;
          console.log(`${newTipEvent.tipperName} - $${newTipEvent.amount}`);
          setTippers((prev) => [ ...prev, `${newTipEvent.tipperName} - $${newTipEvent.amount}` ]);
          break;
        default:
          console.error("Unknown event type", message.type);
      }
    } catch (error) {
      console.error("Error processing item", error);
    }
  };

  const onError = async (
    error: TopicSubscribe.Error,
    sub: TopicSubscribe.Subscription
  ) => {
    console.error("onError", error);
    sub.unsubscribe();
    clearTopicClient();
    await subscribeToTopic(
      cacheName,
      topicName,
      onItem,
      onError
    );
  };

  useEffect(() => {
    subscribeToTopic(
      cacheName,
      topicName,
      onItem,
      onError
    )
    .then(async() => {
      console.log("Subscribed to topic", topicName);
    })
    .catch((error: Error) => {
      console.error("Error subscribing to topic", error);
    })
  }, []);

  return (
    <div className="border-1 border-purple-300 bg-purple-200">
      <div className="container relative h-20 mx-auto w-full max-w-6xl mt-2 px-4 sm:px-6 lg:px-8">
        <div className="w-full grid grid-flow-col gap-4 grid-cols-[60%]">
          <div className="flex items-center justify-start">
            <Button text="Tip!" big={ true } link={ paymentLink } />
            
            <div className="relative ml-2">
              <Scroller text="Thanks to..." items={ tippers } />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full p-2 border-l-1 border-slate-400">
            <ProgressBar text="Let's raise $100!" value={ total } max={ 100 } />
          </div>
        </div>

      </div>  
    </div>
  )
}