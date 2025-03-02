import express from "express";
import {
  judgeCode,
  getResults,
  shareCode,
} from "../controllers/judge.controller";

const router = express.Router();

router.post("/judge", judgeCode);
router.post("/share", shareCode);

router.get("/share/:taskId", getResults);
router.get("/result/:taskId", getResults);

export default router;
