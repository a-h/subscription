import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as appsync from "@aws-cdk/aws-appsync";
import * as lambda from "@aws-cdk/aws-lambda";
import * as path from "path";
import * as lambdaNode from "@aws-cdk/aws-lambda-nodejs";

export class SubscriptionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // There's a ./schema.graphql file I added alongside to define the schema for the service.
    // Had to import the required node packages too.
    // The examples here, needed some modification: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-appsync-readme.html
    const api = new appsync.GraphqlApi(this, "subscriptionApi", {
      name: "subscriptionApi",
      schema: appsync.Schema.fromAsset(
        path.join(__dirname, "../graphql/schema.graphql")
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
        additionalAuthorizationModes: [{ authorizationType: appsync.AuthorizationType.IAM }],
      },
      xrayEnabled: true,
    });
    // print out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });
    // print out the AppSync API Key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });
    // print out the stack region
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region,
    });

    const onSendMessage = new lambdaNode.NodejsFunction(this, "onSendMessage", {
      runtime: lambda.Runtime.NODEJS_12_X,
      entry: path.join(
        __dirname,
        "../handlers/graphql/subscription/onSendMessage.ts"
      ),
      handler: "handler",
      memorySize: 1024,
      tracing: lambda.Tracing.ACTIVE,
    });

    api.addLambdaDataSource("onSendMessageDS", onSendMessage).createResolver({
      typeName: "Subscription",
      fieldName: "onSendMessage",
    });

    const sendMessage = new lambdaNode.NodejsFunction(this, "sendMessage", {
      runtime: lambda.Runtime.NODEJS_12_X,
      entry: path.join(
        __dirname,
        "../handlers/graphql/mutation/sendMessage.ts"
      ),
      handler: "handler",
      memorySize: 1024,
      tracing: lambda.Tracing.ACTIVE,
    });

    api.addLambdaDataSource("sendMessageDS", sendMessage).createResolver({
      typeName: "Mutation",
      fieldName: "sendMessage",
    });

    // Create something to send messages to anyone that's subscribed from the server side.
    // The mutation isn't permitted by anyone from the client side.
    const lambdaMessageSender = new lambdaNode.NodejsFunction(this, "lambdaMessageSender", {
      runtime: lambda.Runtime.NODEJS_12_X,
      entry: path.join(
        __dirname,
        "../handlers/none/sendMessage.ts"
      ),
      handler: "handler",
      memorySize: 1024,
      tracing: lambda.Tracing.ACTIVE,
      timeout: cdk.Duration.seconds(20),
      environment: {
        APPSYNC_REGION: this.region,
        APPSYNC_ENDPOINT_URL: api.graphqlUrl,
      }
    });
    api.grant(lambdaMessageSender, appsync.IamResource.custom('types/Mutation/fields/sendMessage'), 'appsync:GraphQL');
    api.grant(lambdaMessageSender, appsync.IamResource.custom('types/Mutation/types/Message'), 'appsync:GraphQL');
  }
}
