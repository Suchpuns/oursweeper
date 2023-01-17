// Handles creating the board.
// Receiving inputs to the board.
// Broadcasts the board to given room everytime it changes.
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { Server, Socket } from "socket.io";
import { Room, ISocket, Cell } from "../interfaces";
import { rooms } from "./roomHandler";
import { isValidCoords, isWin, unCoverTile, unCoverFirstTile, createBoard } from "../routes/board";

const registerGameHandlers = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, socket: ISocket) => {
  const revealTile = (x: string | number, y: string | number, roomName: string, first: boolean = true) => {
    console.log('revealing tile');
    console.log(`is first: ${first}`);
    x = parseInt(x as string);
    y = parseInt(y as string)
    if (socket.username === undefined) {
        console.log("username is undefined");
        socket.emit("error", "Socket does not have username");
        return;
    }
    if (rooms[roomName] === undefined) {
      console.log("room does not exist");
      socket.emit("error", "given room does not exist");
      return;
    }
    if (isValidCoords(rooms[roomName][socket.username], x, y) === false) {
      console.log("invalid coordinates");
      socket.emit("error", "invalid coordinates");
      return;
    }
    if (first) {
      console.log("unconvering first tile");
      rooms[roomName][socket.username] = unCoverFirstTile(rooms[roomName][socket.username], x, y);
    }
    if (rooms[roomName][socket.username][x][y].value === -1) {
      socket.emit("game", "bomb");
      rooms[roomName][socket.username] = createBoard(1);
      io.to(roomName).emit("boards", JSON.stringify(rooms[roomName]), socket.username);
      return;
    }
    rooms[roomName][socket.username] = unCoverTile(rooms[roomName][socket.username], x, y);
    io.to(roomName).emit("boards", JSON.stringify(rooms[roomName]), socket.username);
    if (isWin(rooms[roomName][socket.username]) === true) {
      console.log(`${socket.username} has won!`);
      socket.emit("game", "win");
      socket.broadcast.to(roomName).emit("game", "lost");
      return;
    }
    return;
  }

  const getBoard = (roomName: string) => {
    if (rooms[roomName] === undefined) {
      console.log("room does not exist");
      socket.emit("error", "given room does not exist");
      return;
    }
    console.log(rooms[roomName]);
    io.to(roomName).emit("boards", JSON.stringify(rooms[roomName]), socket.username);
  }

  const pushBoard = (roomName: string, board: Cell[][]) => {
    if (rooms[roomName] === undefined) {
      console.log("room does not exist");
      socket.emit("error", "given room does not exist");
      return;
    }
    if (socket.username === undefined) {
      console.log("Username not given");
      socket.emit("error", "Username not given");
      return;
    }
    rooms[roomName][socket.username] = board;
    // Check for win
    if (isWin(rooms[roomName][socket.username]) === true) {
      console.log(`${socket.username} has won!`);
      socket.emit("game", "win");
      socket.broadcast.to(roomName).emit("game", "lost");
      return;
    }
    socket.broadcast.to(roomName).emit("boards", JSON.stringify(rooms[roomName]), socket.username);
    return;
  }
  socket.on("game:revealTile", revealTile);
  socket.on("game:getBoard", getBoard);
  socket.on("game:pushBoard", pushBoard);
}

export { registerGameHandlers as default }