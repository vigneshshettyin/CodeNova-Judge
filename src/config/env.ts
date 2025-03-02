import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://localhost",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  TTL: 1800,
};
