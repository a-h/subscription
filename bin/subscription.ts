#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SubscriptionStack } from '../lib/subscription-stack';

const app = new cdk.App();
new SubscriptionStack(app, 'SubscriptionStack');
