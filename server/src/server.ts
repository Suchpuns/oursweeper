import express, { Express, Request, Response } from "express";
import { Cell } from "./interfaces";
import boardRoutes from "./routes/board";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
require("source-map-support").install();
dotenv.config();

const app: Express = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FE_URL,
    credentials: true,
  })
);

const port = process.env.PORT;

// Middleware
app.use(morgan("tiny"));

app.get("/", (req: Request, res: Response) => {
  res.send("HOP ON GANG");
});

app.use("/board", boardRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
