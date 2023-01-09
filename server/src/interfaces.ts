import { Socket } from "socket.io";

interface Cell {
  value: number;
  hidden: Boolean;
}

interface ISocket extends Socket {
  username?: string;
  roomName?: string;
}

interface Disconnect {
  username: string;
  timeOutObj: NodeJS.Timeout;
}

// maps username to their respective board.
type Room = Record<string, Cell[][]>;

export { Cell, ISocket, Room, Disconnect };
