import amqp from "amqplib";
import { config } from "../config/env";
import { executeCode } from "./executor";
import { redisClient } from "../config/redis";

const QUEUE_NAME = "code_queue";

export const startWorker = async () => {
  try {
    const connection = await amqp.connect(config.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME);
    console.log("Worker listening on", QUEUE_NAME);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;

      const { taskId, code, language, testCases } = JSON.parse(msg.content.toString());
      console.log(`Processing task: ${taskId}`);

      const results = await executeCode(code, language, testCases);
      await redisClient.setex(taskId, config.TTL, JSON.stringify(results));

      console.log(`Completed task: ${taskId}`);
      channel.ack(msg);
    });
  } catch (error) {
    console.error("Worker failed to start:", error);
  }
};
