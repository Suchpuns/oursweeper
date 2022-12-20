import express, { Express, Request, Response } from "express";
import { Cell } from "../interfaces";
const router = express.Router();

/**
 * Generates a minesweeper board and returns it as a 2D array.
 * Query: {
 *  difficulty: integer
 * }
 * Given difficulty is a number from 0-2.
 * 0: easy = 8, 10
 * 1: medium = 14, 40
 * 2: hard = 20, 99
 */
router.get("/generate", (req: Request, res: Response) => {
  const boardSizes = [
    { x: 8, y: 10, bombNum: 10 },
    { x: 14, y: 40, bombNum: 40 },
    { x: 20, y: 99, bombNum: 99 },
  ];
  if (req.query.difficulty === undefined) {
    return res.status(400).send({ error: "Missing difficulty in query" });
  }
  // Create board
  const boardSize = boardSizes[parseInt(req.query.difficulty as string)];
  let board = [] as Cell[][];
  for (let i = 0; i < boardSize.x; i++) {
    board[i] = [] as Cell[];
    for (let j = 0; j < boardSize.y; j++) {
      board[i][j] = { hidden: true, value: 0 };
    }
  }
  // Add bombs
  let bombNum = 0;
  while (bombNum < boardSize.bombNum) {
    let x = Math.round(Math.random() * 1000) % boardSize.x;
    let y = Math.round(Math.random() * 1000) % boardSize.y;
    if (board[x][y].value != -1) {
      board[x][y].value = -1;
      bombNum++;
      // Correct the values adjacent to the bomb
      updateValues(board, x, y);
    }
  }
  return res.status(200).send(board);
});

/**
 * Updates the cell values next to a bomb
 * @param board The 2D array of the board
 * @param x     x position of the bomb
 * @param y     y position of the bomb
 */
function updateValues(board: Cell[][], x: number, y: number): void {
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (
        i != j &&
        i >= 0 &&
        i < board.length &&
        j >= 0 &&
        j < board[0].length
      ) {
        board[i][j].value += 1;
      }
    }
  }
  return;
}

export { router as default };
