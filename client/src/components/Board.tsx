import { BoardAttributes, CellAttributes } from './Helpers';
import BoardRow from './BoardRow';
import { boardState } from '../recoil_state';
import { useRecoilValue } from 'recoil';

const Board = ({ difficulty, revealTile }: BoardAttributes) => {
  let board = useRecoilValue(boardState);
  // let size = difficulty === 0 ? 8 : difficulty === 1 ? 14 : 20;
  // let board: CellAttributes[][] = new Array(size)
  //   .fill({ hidden: true, value: 0 })
  //   .map(() => new Array(size).fill({ hidden: true, value: 0 }));

  // const generateBoard = () => {
  //   for (let x = 0; x < size; x++) {
  //     for (let y = 0; y < size; y++) {
  //       if (x % 2 == 1) {
  //         board[x][y].value = -1;
  //       } else {
  //         board[x][y].value = 1;
  //       }
  //     }
  //   }
  //   return board;
  // };

  return (
    <>
      {board.map((row: CellAttributes[], idx: number) => {
        return <BoardRow key={idx} x={idx} row={row} revealTile={revealTile} />;
      })}
    </>
  );
};

export default Board;
