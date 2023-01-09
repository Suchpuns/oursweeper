import { CellAttributes, CellState } from './Helpers';
import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { boardState, clearFlagsState } from '../recoil_state';
import { useRecoilValue, useRecoilState } from 'recoil';
import React from 'react';

type Props = {
  x: number;
  y: number;
  hidden: boolean;
  value: number;
  revealTile: (x: number, y: number) => void;
  viewOnly: boolean;
};

const Cell = ({ x, y, hidden, value, revealTile, viewOnly }: Props) => {
  const [clearFlags, setClearFlags] = useRecoilState(clearFlagsState);
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: viewOnly === false ? '1.8rem' : '1rem',
    width: viewOnly === false ? '1.8rem' : '1rem',
    borderRadius: '0',
    fontSize: viewOnly === false ? '1.3rem' : '0.8rem',
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
    } else if (cell !== CellState.FLAGGED) {
      setCell(CellState.HIDDEN);
    }
  }, [value, hidden]);

  useEffect(() => {
    if (hidden === true && cell === CellState.FLAGGED) {
      setCell(CellState.HIDDEN);
    }
  }, [clearFlags]);

  const handleLeftClick = () => {
    if (cell !== CellState.FLAGGED) {
      // Update the cell
      hidden = false;
      if (value === -1) {
        setCell(CellState.MINE);
      } else {
        setCell(value);
      }
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

  if (viewOnly === false) {
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
  } else {
    return (
      <Button
        variant="text"
        disabled
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
  }
};

export default Cell;
