# GraphQL Subscription Example

## Subscription

### Subscribe to every topic

```graphql
subscription MySubscription {
  onSendMessage {
    topic
    text
  }
}
```

### Subscribe to specific topic

```graphql
subscription MySubscription {
  onSendMessage(topic: "a") {
    topic
    text
  }
}
```

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
