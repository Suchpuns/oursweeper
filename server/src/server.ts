import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();

const app: Express = express();

const port = process.env.PORT;

// Middleware
app.use(morgan("tiny"));

app.get("/", (req: Request, res: Response) => {
  res.send("HOP ON GANG");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
