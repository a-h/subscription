import { AppSyncResolverEvent } from "aws-lambda";
import { MutationSendMessageArgs, Message } from "../../../graphql/types";

export const handler = async (
  event: AppSyncResolverEvent<MutationSendMessageArgs>
): Promise<Message> => {
  console.log(JSON.stringify(event));

  // If you don't set the mutation as having the same input type as the subscription's return type, then 
  // you'l get an error, as it fails to map the "missing" fields from the first argument
  // of the mutation.
  // 
  //   Error: {
  //     "errors": [
  //         {
  //             "message": "Connection failed: {\"errors\":[{\"errorType\":\"MessageProcessingError\",\"message\":\"There was an error processing the message\"}]}"
  //         }
  //     ]
  // }

  return {
    topic: event.arguments.message.topic,
    text: event.arguments.message.text,
  };
};
