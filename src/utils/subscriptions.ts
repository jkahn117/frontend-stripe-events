import { 
  Configurations,
  CredentialProvider,
  TopicClient,
  TopicItem,
  TopicSubscribe,
  TopicSubscribeResponse
} from "@gomomento/sdk-web";

/**
 * Enum for supported event types.
 */
export enum EventTypes {
  NEW_TIP = "new_tip",
  NEW_TOTAL = "new_total",
}

/**
 * Event type for a new tip.
 */
export type NewTipEvent = {
  type: EventTypes.NEW_TIP;
  tipperName: string;
  amount: number;
}

/**
 * Event type for a new total.
 */
export type NewTotalEvent = {
  type: EventTypes.NEW_TOTAL;
  total: number;
}

/**
 * Union type for tip-related events.
 */
export type TipEvent = NewTipEvent | NewTotalEvent;

let topicClient : TopicClient | undefined = undefined;
let subscription : TopicSubscribe.Subscription | undefined = undefined;

let onItemCallback: (item: TopicItem) => void;
let onErrorCallback: (error: TopicSubscribe.Error, sub: TopicSubscribe.Subscription) => Promise<void>;

/**
 * Creates and returns a new TopicClient instance with a fresh token.
 * @returns {Promise<TopicClient>} The new TopicClient instance.
 */
async function getNewTopicClient() : Promise<TopicClient> {
  topicClient = undefined;

  const resp = await fetch("/api/momento/token", { cache: "no-store" });
  const token = await resp.text();

  const newTopicClient = new TopicClient({
    configuration: Configurations.Browser.latest(),
    credentialProvider: CredentialProvider.fromString({
      apiKey: token,
    }),
  });

  topicClient = newTopicClient;

  return newTopicClient;
}

/**
 * Unsubscribes from the current topic and clears the TopicClient instance.
 */
export const clearTopicClient = () => {
  subscription?.unsubscribe();
  subscription = undefined;
  topicClient = undefined;
}

/**
 * Subscribes to a Momento topic and sets up item and error callbacks.
 * @param {string} cacheName - The name of the cache to subscribe to.
 * @param {string} topicName - The name of the topic to subscribe to.
 * @param {(item: TopicItem) => void} onItem - Callback for received topic items.
 * @param {(error: TopicSubscribe.Error, sub: TopicSubscribe.Subscription) => Promise<void>} onError - Callback for subscription errors.
 * @returns {Promise<TopicSubscribe.Subscription>} The subscription object.
 * @throws Will throw an error if subscription fails.
 */
export async function subscribeToTopic(
  cacheName: string,
  topicName: string,
  onItem: (item: TopicItem) => void,
  onError: (error: TopicSubscribe.Error, sub: TopicSubscribe.Subscription) => Promise<void>
) {

  console.log(`Subscribing to cacheName=${cacheName}, topicName=${topicName}`);

  onItemCallback = onItem;
  onErrorCallback = onError;

  const topicClient = await getNewTopicClient();
  const resp = await topicClient.subscribe(cacheName, topicName, {
    onItem: onItemCallback,
    onError: onErrorCallback,
  });

  switch(resp.type) {
    case TopicSubscribeResponse.Subscription:
      subscription = resp;
      return subscription;
    case TopicSubscribeResponse.Error:
      console.error("Error subscribing to topic", resp);
      throw new Error(`Error subscribing to topic: ${resp}`);
  }
}