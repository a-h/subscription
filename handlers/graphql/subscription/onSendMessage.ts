import { AppSyncResolverEvent, AppSyncResolverHandler } from "aws-lambda";
import { Message, SubscriptionOnSendMessageArgs } from "../../../graphql/types";
import log from "../../../log";

export const handler: AppSyncResolverHandler<
  SubscriptionOnSendMessageArgs,
  Message
> = async (
  event: AppSyncResolverEvent<SubscriptionOnSendMessageArgs>
): Promise<Message> => {
  // This Lambda function is called once, when the subscription is initiated. It has to return "something" that
  // can do equality matches against the arguments of the Lambda.
  //
  // Here, the subscription is: onSendMesssage(topic: ID): Message!
  // The object returned from this just needs to contain the subscription filter.
  // 
  // In this example, to filter by topic, the topic field must be in the return type, and be set to the same value as the argument.
  // To subscribe to all topics, the topic field in the return type should be set to null.
  //
  // The "text" field returned by this function will not affect the filtering, because there's no matching "text" input argument. It's actually safe to set it to anything, it doesn't have to be null etc.
  //
  // The return type of the subscription must match the schema of the mutation. So to match on any topic, the topic field must be set to null. This has the knock-on effect that the mutation return type schema must also have a nullable topic field.
  //
  // To stop someone from subscribing to something that they shouldn't have access to, you can
  // design your subscription to use the event.identity in the filter, or you can throw an error
  // or set the filter field to a string that will never be used if they're attempting to subscribe to something that they're not allowed to.
  log.debug("received identity", event.identity);
  return {
    topic: event.arguments.topic,
    text: "",
  };
};
