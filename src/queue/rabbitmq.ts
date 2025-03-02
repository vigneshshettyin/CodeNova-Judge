import amqp from "amqplib";
import { config } from "../config/env";

export const QUEUE_NAME = "code_queue";
let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect(config.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME);
  console.log("Connected to RabbitMQ");
};

export const publishTask = async (task: any) => {
  if (!channel) await connectRabbitMQ();
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(task)));
};

connectRabbitMQ();
