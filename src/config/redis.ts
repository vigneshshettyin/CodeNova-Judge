import Redis from "ioredis";
import { config } from "./env";

export const redisClient = new Redis(config.REDIS_URL);

export const setKey = async (key: string, value: string) => {
  await redisClient.set(key, value, "EX", config.TTL + 86400);
};
