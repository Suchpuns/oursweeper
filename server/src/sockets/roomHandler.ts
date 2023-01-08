// Creates rooms

import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { Server, Socket } from "socket.io";
import { Room, ISocket, Disconnect } from "../interfaces";
import { createBoard } from "../routes/board";

const rooms: Record<string, Room> = {};

const disconnectedUsers: Record<string, Disconnect[]> = {};
// Allows users to join/leave rooms
// BOARD IS ALWAYS DIFFICULTY 1
const registerRoomHandlers = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, socket: ISocket) => {
  const createRoom = (roomName: string) => {
    if (socket.username === undefined) {
      console.log("username is undefined");
      socket.emit("error", "Socket does not have username");
      return;
    }
    if (rooms[roomName] !== undefined) {
      console.log("room already exists!");
      socket.emit("error", "room already exists");
      return;
    }
    socket.join(roomName);
    socket.roomName = roomName;
    rooms[roomName] = {};
    rooms[roomName][socket.username] = createBoard(1);
    console.log("creating room")
    socket.emit("boards", JSON.stringify(rooms[roomName]));
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
      // User is already in room so throw error, unless the user is reconnecting
      const userIndex = disconnectedUsers[roomName].findIndex((user) => {return user.username === socket.username});
      if (userIndex === -1) {
        // User is not reconnecting
        console.log("username taken/already in room");
        socket.emit("error", "chosen username already in room");
        return;
      }
      // User is reconnecting
      socket.roomName = roomName;
      clearTimeout(disconnectedUsers[roomName][userIndex].timeOutObj);
      disconnectedUsers[roomName].splice(userIndex, 1);
      console.log(`${socket.username} has reconnected`);
      socket.join(roomName);
      socket.emit("game-reconnect");
      socket.emit("boards", JSON.stringify(rooms[roomName]));
      return;
    }
    console.log("joining room")
    rooms[roomName][socket.username] = createBoard(1);
    socket.join(roomName);
    socket.roomName = roomName;
    socket.emit("boards", JSON.stringify(rooms[roomName]));
  }

  const disconnect = () => {
    if (socket.roomName === undefined) {
      console.log('user is not in any room so ignore');
      return;
    }
    if (socket.username === undefined) {
      console.log('Error - no username');
      return;
    }
    console.log(`${socket.username} has disconnected. Will remove from ${socket.roomName} in 10 seconds`);
    const removeUser = setTimeout(() => {
      if (socket.roomName === undefined) {
        console.log('Error - no roomName');
        return;
      }
      if (socket.username === undefined) {
        console.log('Error - no username');
        return;
      }
      console.log(`${socket.username} is removed from room`);
      delete rooms[socket.roomName][socket.username]
      if (Object.keys(rooms[socket.roomName]).length === 0) {
        console.log(`No users left in ${socket.roomName}. Deleting room`);
        delete rooms[socket.roomName];
      }
      // console.log(rooms);
    }, 10000);
    // Store the disconnected user so they can still reconnect.
    if (disconnectedUsers[socket.roomName] === undefined) {
      disconnectedUsers[socket.roomName] = [];
    }
    const user = disconnectedUsers[socket.roomName].find((user) => {return user.username === socket.username});
    // If user is not undefined that means that the user is already disconnected so don't do anything   
    if (user === undefined) {
      // Store the pending user disconnect
      disconnectedUsers[socket.roomName].push({username: socket.username, timeOutObj: removeUser});
    } else {
      return;
    }
    // console.log(disconnectedUsers);
  }

  socket.on("room:create", createRoom);
  socket.on("room:join", joinRoom);
  socket.on("disconnect", disconnect);

}

export { registerRoomHandlers as default, rooms}