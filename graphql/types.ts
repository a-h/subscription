export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  messages: Array<Message>;
};

export type Message = {
  __typename?: 'Message';
  topic: Scalars['ID'];
  text: Scalars['String'];
};

export type SendMessageInput = {
  topic: Scalars['ID'];
  text: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  sendMessage?: Maybe<Message>;
};


export type MutationSendMessageArgs = {
  message: SendMessageInput;
};

export type Subscription = {
  __typename?: 'Subscription';
  onSendMessage?: Maybe<Message>;
};


export type SubscriptionOnSendMessageArgs = {
  topic: Scalars['ID'];
};
