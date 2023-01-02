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
      if (i >= 0 && i < board.length && j >= 0 && j < board[0].length && board[i][j].value != -1) {
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
    { x: 14, y: 18, mineNum: 40 },
    { x: 20, y: 24, mineNum: 99 },
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

/**
 * Identifies whether the given x and y values are valid for the given board.
 * @param board Minesweeper board detailing where the bombs are
 * @param x x coordinate
 * @param y y coordinate
 * @returns Boolean on whether the x and y coordinates are valid
 */
export function isValidCoords(board: Cell[][], x: number, y: number): boolean {
  const rows = board.length;
  const cols = board[0].length;
  if (x < 0 || x >= rows || y < 0 || y >= cols) {
    return false;
  }
  return true;
}

/**
 * Identifies whether all non-bomb tiles have been revealed
 * @param board Minesweeper board detailing where the bombs are
 */
export function isWin(board: Cell[][]): boolean {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j].value != -1 && board[i][j].hidden === true) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Uncovers the tiles
 * @param board 
 */
export function unCoverTile(board: Cell[][], x: number, y: number): Cell[][] {
  if (isValidCoords(board, x, y) === false) {
    return board;
  }
  console.log(x, y);
  board[x][y].hidden = false;
  if (board[x][y].value === 0) {
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i >= 0 && i < board.length && j >= 0 && j < board[0].length && board[i][j].value !== -1 && board[i][j].hidden === true) {
          board = unCoverTile(board, i, j);
        }
      }
    }
  }
  return board;
}

/**
 * Handle uncovering the first tile
 * Removes bomb/bombs 1 tile away from chosen tile and moves it elsewhere
 * If there are no more spaces to move the bomb to, remove the bomb.
 */
export function unCoverFirstTile(board: Cell[][], x: number, y: number): Cell[][] {
  if (isValidCoords(board, x, y) === false) {
    console.log("invalid coords given");
    return board;
  }
  let mineNum = 0;
  if (board[x][y].value !== 0) {
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i >= 0 && i < board.length && j >= 0 && j < board[0].length && board[i][j].value === -1) {
          mineNum++;
          board = removeBomb(board, i, j);
        }
      }
    }
  }
  console.log(mineNum);
  // Add the bombs back but elsewhere
  while (mineNum > 0) {
    let row = Math.round(Math.random() * 1000) % board.length;
    let col = Math.round(Math.random() * 1000) % board[0].length;
    // If not bomb and also not adjacent to the original coords.
    if (board[row][col].value != -1 && !isAdjacent(board, row, col, x, y)) {
      board[row][col].value = -1;
      mineNum--;
      // Correct the values adjacent to the mine
      updateValues(board, row, col);
    }
  }
  unCoverTile(board, x, y);
  return board;
}


export function isAdjacent(board: Cell[][], x: number, y: number, x2: number, y2: number): boolean {
  let xDiff = Math.abs(x - x2);
  let yDiff = Math.abs(y - y2);
  if (xDiff <= 1 && yDiff <= 1) {
    return true;
  }
  return false;
}

/**
 * Removes a bomb from the board. Also updates the values around it.
 * Assumes that the values are previously correct
 * @param board 
 * @param x 
 * @param y 
 */
function removeBomb(board: Cell[][], x: number, y: number): Cell[][] {
  if (board[x][y].value !== -1) {
    console.log("ERROR: no bomb");
    return board;
  }
  board[x][y].value = 0;
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i >= 0 && i < board.length && j >= 0 && j < board[0].length && board[i][j].value !== -1) {
        board[i][j].value -= 1;
      }
      if (i >= 0 && i < board.length && j >= 0 && j < board[0].length && board[i][j].value === -1) {
        board[x][y].value += 1;
      }
    }
  }
  return board;
}

export { router as default };
