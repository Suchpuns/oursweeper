// Handles creating the board.
// Receiving inputs to the board.
// Broadcasts the board to given room everytime it changes.
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { Server, Socket } from "socket.io";
import { Room, ISocket } from "../interfaces";
import { rooms } from "./roomHandler";
import { isValidCoords, isWin, unCoverTile, unCoverFirstTile, createBoard } from "../routes/board";

const registerGameHandlers = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, socket: ISocket) => {
  const revealTile = (x: string | number, y: string | number, roomName: string, first: boolean = true) => {
    console.log('revealing tile');
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
    if (rooms[roomName][socket.username][x][y].value === -1) {
      socket.emit("game", "bomb");
      rooms[roomName][socket.username] = createBoard(1);
    }
    if (first) {
      rooms[roomName][socket.username] = unCoverFirstTile(rooms[roomName][socket.username], x, y);
    }
    rooms[roomName][socket.username] = unCoverTile(rooms[roomName][socket.username], x, y);
    socket.emit("boards", JSON.stringify(rooms[roomName]));
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
    socket.to(roomName).emit("boards", rooms[roomName]);
  }

  socket.on("game:revealTile", revealTile);
  socket.on("game:getBoard", getBoard);
}

export { registerGameHandlers as default }