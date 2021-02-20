import { Context } from "aws-lambda";
import gql from "graphql-tag";
import { ExecutionResult } from "graphql";
import { Message, SendMessageInput } from "../../graphql/types";
import log from "../../log/";
import AppsyncClient from "appsync-client";

// This Lambda handler is designed to be triggered from the console, or
// from the CLI with a payload. It could be modified to accept an EventBridge
// event, or be triggered by an API Gateway request.
export const handler = async (
  event: Message,
  _context: Context
): Promise<void> => {
  if (!process.env.APPSYNC_ENDPOINT_URL || !process.env.APPSYNC_REGION) {
    throw new Error(
      "must set the APPSYNC_ENDPOINT_URL and APPSYNC_REGION environment variables"
    );
  }
  log.debug("sending request", {
    endpoint: process.env.APPSYNC_ENDPOINT_URL,
    region: process.env.APPSYNC_REGION,
  });
  const message: SendMessageInput = {
    topic: event.topic,
    text: event.text,
  };
  await sendMessage(
    process.env.APPSYNC_ENDPOINT_URL,
    process.env.APPSYNC_REGION,
    message
  );
};

const SEND_MESSAGE = gql(`
mutation sendMessage($message: SendMessageInput!) {
  sendMessage(message: $message) {
    topic
    text
  }
}`);

const sendMessage = async (
  endpoint: string,
  region: string,
  message: SendMessageInput
): Promise<ExecutionResult<Message>> => {
  log.debug("creating client", { endpoint, region });
  const client = new AppsyncClient({
    apiUrl: endpoint,
  });
  log.debug("executing request", { endpoint, region });
  return await client.request({
    query: SEND_MESSAGE,
    variables: {
      message,
    },
  });
};
