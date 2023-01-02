import express, { Express, Request, Response } from "express";
import { ISocket } from "./interfaces";
import boardRoutes from "./routes/board";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import registerRoomHandlers from "./sockets/roomHandler";
import registerGameHandlers from "./sockets/gameHandler";

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
io.use((socket: ISocket, next) => {
  const username: string = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("no username"));
  }
  socket.username = username;
  next();
})

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
const onConnection = (socket: ISocket) => {
  registerRoomHandlers(io, socket);
  registerGameHandlers(io, socket);
}

io.on("connection", onConnection);


server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
