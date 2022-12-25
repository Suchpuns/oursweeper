import { Socket } from 'socket.io-client';

export type CellAttributes = {
  hidden: boolean;
  value: number;
};

export type BoardAttributes = {
  difficulty: number;
  board: CellAttributes[][];
};

export enum CellState {
  FLAGGED = '🚩',
  MINE = '💣',
  HIDDEN = '',
  REVEALED = 'REVEALED',
}
