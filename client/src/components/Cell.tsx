import { CellAttributes, CellState } from './Helpers';
import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import React from 'react';

type Props = {
  x: number;
  y: number;
  hidden: boolean;
  value: number;
  revealTile: (x: number, y: number) => void;
};

const Cell = ({ x, y, hidden, value, revealTile }: Props) => {
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

  useEffect(() => {
    if (hidden === false) {
      if (value === -1) {
        setCell(CellState.MINE);
      } else {
        setCell(value);
      }
    }
  }, [hidden]);

  const handleLeftClick = () => {
    if (cell !== CellState.FLAGGED) {
      revealTile(x, y);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cell === CellState.FLAGGED) {
      setCell(CellState.HIDDEN);
      setIsHidden(!isHidden);
    } else if (hidden) setCell(CellState.FLAGGED);
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
