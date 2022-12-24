import express, { Express, Request, Response } from "express";
import { Cell } from "./interfaces";
import boardRoutes from "./routes/board";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

require("source-map-support").install();
dotenv.config();
const port = process.env.PORT;
const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // TODO CHANGE TO PROPER URL
    origin: '*',
  }
});
/*
////////////////////
      MIDDLEWARE
////////////////////
*/
app.use(express.json());
app.use(
  cors({
    origin: process.env.FE_URL,
    credentials: true,
  })
);
app.use(morgan("tiny"));

/*
////////////////////
      ROUTES
////////////////////
*/
app.get("/", (req: Request, res: Response) => {
  res.send("HOP ON GANG");
});
app.use("/board", boardRoutes);



/*
////////////////////
      WEBSOCKETS
////////////////////
*/
io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
