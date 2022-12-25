import { diffieHellman } from "crypto";
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
  if (req.query.difficulty === undefined) {
    return res.status(400).send({ error: "Missing difficulty in query." });
  }
  let board = createBoard(parseInt(req.query.difficulty as string));
  return res.status(200).send(board);
});

/**
 * Updates the cell values next to a mine
 * @param board The 2D array of the board
 * @param x     x position of the mine
 * @param y     y position of the mine
 */
function updateValues(board: Cell[][], x: number, y: number): void {
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i != j && i >= 0 && i < board.length && j >= 0 && j < board[0].length && board[i][j].value != -1) {
        board[i][j].value += 1;
      }
    }
  }
  return;
}

/**
 * Generates a minesweeper board and returns it as a 2D array.
 * @param difficulty The difficulty of the board
 * Given difficulty is a number from 0-2.
 * 0: easy = 8, 10
 * 1: medium = 14, 40
 * 2: hard = 20, 99
 */
export function createBoard(difficulty: number): Cell[][] {
  const boardSizes = [
    { x: 8, y: 10, mineNum: 10 },
    { x: 14, y: 40, mineNum: 40 },
    { x: 20, y: 99, mineNum: 99 },
  ];
  // Create board
  const boardSize = boardSizes[difficulty];
  let board = [] as Cell[][];
  for (let i = 0; i < boardSize.x; i++) {
    board[i] = [] as Cell[];
    for (let j = 0; j < boardSize.y; j++) {
      board[i][j] = { hidden: true, value: 0 };
    }
  }
  // Add mines
  let mineNum = 0;
  while (mineNum < boardSize.mineNum) {
    let x = Math.round(Math.random() * 1000) % boardSize.x;
    let y = Math.round(Math.random() * 1000) % boardSize.y;
    if (board[x][y].value != -1) {
      board[x][y].value = -1;
      mineNum++;
      // Correct the values adjacent to the mine
      updateValues(board, x, y);
    }
  }
  printBoard(board);
  return board;
}


function printBoard(board: Cell[][]): void {
  let row: string = "";
  for (let i = 0; i < board.length; i++) {
    row = "";
    for (let j = 0; j < board[0].length; j++) {
      row += " \t" + board[i][j].value.toString();
    }
    console.log(row);
  }
}
export { router as default };
