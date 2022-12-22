import { CellAttributes, CellState } from './Helpers';
import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useState } from 'react';
import React from 'react';

const Cell = ({ hidden, value }: CellAttributes) => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '2rem',
    width: '2rem',
    borderRadius: '0',
    fontSize: '1.3rem',
  }));

  const [cell, setCell] = useState<CellState | number>(CellState.HIDDEN);
  const [isHidden, setIsHidden] = useState<boolean>(hidden);

  const handleLeftClick = () => {
    if (cell !== CellState.FLAGGED) {
      value === -1 ? setCell(CellState.MINE) : setCell(value);
      setIsHidden(!isHidden);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cell === CellState.FLAGGED) {
      setCell(CellState.HIDDEN);
      setIsHidden(!isHidden);
    } else if (isHidden) setCell(CellState.FLAGGED);
  };

  return (
    <Button
      variant="text"
      onClick={handleLeftClick}
      onContextMenu={(e) => {
        handleRightClick(e);
      }}
      sx={{
        padding: '0',
        minWidth: '0',
        border: '1px black solid',
        borderRadius: 0,
      }}
    >
      <Item>{cell}</Item>
    </Button>
  );
};

export default Cell;
