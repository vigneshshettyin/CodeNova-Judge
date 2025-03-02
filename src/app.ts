import express from "express";
// cors
import cors from "cors";
import bodyParser from "body-parser";
import judgeRoutes from "./api/routes/judge.routes";
import "./queue/rabbitmq";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", judgeRoutes);

export default app;
