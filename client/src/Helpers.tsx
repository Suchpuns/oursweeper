export type CellAttributes = {
  hidden: boolean;
  value: number;
};

export type BoardAttributes = {
  difficulty: number;
};

export enum CellState {
  FLAGGED = "🚩",
  MINE = "💣",
  HIDDEN = "",
  REVEALED = "REVEALED",
}
