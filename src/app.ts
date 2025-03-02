import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import judgeRoutes from "./api/routes/judge.routes";
import "./queue/rabbitmq";

const app = express();

const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN || "http://localhost:3000";
const corsOptions = {
  origin: CLIENT_DOMAIN,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use("/api", judgeRoutes);

export default app;
