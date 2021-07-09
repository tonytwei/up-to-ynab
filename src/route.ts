import { WebhookEventCallback } from "up-bank-api";
import { createHmac } from "crypto";
import { transactionCreated, transactionUpdated } from "./processing";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";

const UP_WEBHOOK_SECRET = process.env.UP_WEBHOOK_SECRET || "";

const app = new Koa();

app.use(bodyParser());
app.use(async (ctx) => {
  const body = ctx.request.rawBody || "";
  const headers = Object.entries(ctx.header).reduce((acc, [key, val]) => ({ ...acc, [key.toLowerCase()]: val }), {});
  const buildSignature = (body) => createHmac("sha256", UP_WEBHOOK_SECRET).update(body).digest("hex");

  console.log(`Webhook: ${body}`);
  const expectedSignature = headers["x-up-authenticity-signature"];
  const actualSignature = buildSignature(body);
  if (expectedSignature !== actualSignature) {
    console.log(`Invalid signature - expected: ${expectedSignature}, actual: ${actualSignature}`);
    ctx.throw(401);
  }

  const parsedBody = JSON.parse(body);

  if (!parsedBody.data || parsedBody.data.type !== "webhook-events") {
    ctx.status = 200;
  }

  const webhookEventData = (parsedBody as WebhookEventCallback).data;

  if (webhookEventData.attributes.eventType === "TRANSACTION_CREATED") {
    await transactionCreated(webhookEventData.relationships.transaction);
  } else if (webhookEventData.attributes.eventType === "TRANSACTION_SETTLED") {
    await transactionUpdated(webhookEventData.relationships.transaction);
  } else if (webhookEventData.attributes.eventType === "TRANSACTION_DELETED") {
    console.log("Transaction deleted");
  } else {
    console.log("Skipping");
  }

  ctx.status = 200;
});

app.on("error", console.error);

export default app;
