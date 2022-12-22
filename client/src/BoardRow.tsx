import Cell from "./Cell";
import { CellAttributes } from "./Helpers";

type Props = {
  row: CellAttributes[];
};

const BoardRow = ({ row }: Props) => {
  return (
    <div style={{ display: "flex" }}>
      {row.map((cell: CellAttributes, idx: number) => {
        return <Cell key={idx} hidden={cell.hidden} value={cell.value} />;
      })}
    </div>
  );
};

export default BoardRow;
