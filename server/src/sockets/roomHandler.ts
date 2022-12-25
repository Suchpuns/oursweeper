// Creates rooms

import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { Server, Socket } from "socket.io";
import { Room, ISocket } from "../interfaces";
import { createBoard } from "../routes/board";

const rooms: Record<string, Room> = {};

// Allows users to join/leave rooms
// BOARD IS ALWAYS DIFFICULTY 1
const registerRoomHandlers = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, socket: ISocket) => {
  const createRoom = (roomName: string) => {
    if (socket.username === undefined) {
      console.log("username is undefined");
      socket.emit("error", "Socket does not have username");
      return;
    }
    socket.join(roomName);
    rooms[roomName] = {};
    rooms[roomName][socket.username] = createBoard(1);
    console.log("creating room")
  }

  const joinRoom = (roomName: string) => {
    if (rooms[roomName] === undefined) {
      console.log("Room does not exist");
      socket.emit("error", "Room does not exist");
      return;
    }
    if (socket.username === undefined) {
      console.log("username is undefined");
      socket.emit("error", "Socket does not have username");
      return;
    }
    if (rooms[roomName][socket.username] !== undefined) {
      console.log("username taken/already in room");
      socket.emit("error", "chosen username already in room");
      return;
    }
    console.log("joining room")
    rooms[roomName][socket.username] = createBoard(1);
  }

  socket.on("room:create", createRoom);
  socket.on("room:join", joinRoom);
}

export { registerRoomHandlers as default, rooms}