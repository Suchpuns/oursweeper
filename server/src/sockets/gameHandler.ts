// Handles creating the board.
// Receiving inputs to the board.
// Broadcasts the board to given room everytime it changes.
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { Server, Socket } from "socket.io";
import { Room, ISocket } from "../interfaces";
import { rooms } from "./roomHandler";

const registerGameHandlers = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, socket: ISocket) => {

}