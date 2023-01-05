import Cell from './Cell';
import { CellAttributes } from './Helpers';

type Props = {
  x: number;
  row: CellAttributes[];
  revealTile: (x: number, y: number) => void;
};

const BoardRow = ({ x, row, revealTile }: Props) => {
  return (
    <div style={{ display: 'flex' }}>
      {row.map((cell: CellAttributes, idx: number) => {
        return (
          <Cell
            key={idx}
            x={x}
            y={idx}
            hidden={cell.hidden}
            value={cell.value}
            revealTile={revealTile}
          />
        );
      })}
    </div>
  );
};

export default BoardRow;
