import { Socket } from 'socket.io-client';

export type CellAttributes = {
  hidden: boolean;
  value: number;
};

export type BoardAttributes = {
  difficulty: number;
  revealTile: (x: number, y: number) => void;
};

export enum CellState {
  FLAGGED = '🚩',
  MINE = '💣',
  HIDDEN = '',
  REVEALED = 'REVEALED',
}
