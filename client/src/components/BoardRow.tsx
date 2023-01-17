import Cell from './Cell';
import { CellAttributes } from './Helpers';
import { useRecoilValue, useRecoilState } from 'recoil';
import { boardState, clearFlagsState } from '../recoil_state';

type Props = {
  x: number;
  row: CellAttributes[];
  revealTile: (x: number, y: number) => void;
  viewOnly: boolean;
};

const BoardRow = ({ x, row, revealTile, viewOnly }: Props) => {
  const [clearFlags, setClearFlags] = useRecoilState(clearFlagsState);
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
            viewOnly={viewOnly}
            clearFlags={clearFlags}
          />
        );
      })}
    </div>
  );
};

export default BoardRow;
