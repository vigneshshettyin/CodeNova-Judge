import express, { Request, Response } from "express";
import { publishTask } from "../../queue/rabbitmq";
import { v4 as uuidv4 } from "uuid";
import { redisClient, setKey } from "../../config/redis";

export const judgeCode: express.RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code, language, testCases } = req.body;
  if (!code || !language || !testCases) {
    res.status(400).json({ error: "Missing required fields" });
  }

  const taskId = uuidv4();
  await publishTask({ taskId, code, language, testCases });

  res.json({ taskId });
};

export const shareCode: express.RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code, language, testCases } = req.body;
  if (!code || !language || !testCases) {
    res.status(400).json({ error: "Missing required fields" });
  }

  const taskId = uuidv4();
  await setKey(taskId, JSON.stringify({ code, language, testCases }));

  res.status(200).json({ taskId });
};

export const getResults: express.RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;

  if (!taskId) {
    res.status(400).json({ error: "Missing taskId" });
    return;
  }

  const results = await redisClient.get(taskId);

  if (!results) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.status(200).json(JSON.parse(results));
};
