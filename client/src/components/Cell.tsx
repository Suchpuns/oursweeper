import { CellState } from './Helpers';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import React from 'react';

type Props = {
  x: number;
  y: number;
  hidden: boolean;
  value: number;
  revealTile: (x: number, y: number) => void;
  viewOnly: boolean;
  clearFlags: number;
};

type States = {
  cell: CellState | number;
  Item: any;
};

class Cell extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.handleLeftClick.bind(this);
    this.handleRightClick.bind(this);
    this.state = {
      cell: CellState.HIDDEN,
      Item: styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: this.props.viewOnly === false ? '1.8rem' : '1rem',
        width: this.props.viewOnly === false ? '1.8rem' : '1rem',
        borderRadius: '0',
        fontSize: this.props.viewOnly === false ? '1.3rem' : '0.8rem',
      })),
    };
  }

  componentDidMount() {
    if (this.props.hidden === false) {
      if (this.props.value === -1) {
        this.setState({ cell: CellState.MINE });
      } else {
        this.setState({ cell: this.props.value });
      }
    } else if (this.state.cell !== CellState.FLAGGED) {
      this.setState({ cell: CellState.HIDDEN });
    }
  }

  shouldComponentUpdate(nextProps: Props, nextStates: States) {
    if (
      nextProps.hidden !== this.props.hidden ||
      nextProps.value !== this.props.value ||
      nextProps.clearFlags !== this.props.clearFlags ||
      nextStates.cell !== this.state.cell
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps: Props, prevState: States) {
    if (prevProps.clearFlags !== this.props.clearFlags) {
      if (this.props.hidden === true && this.state.cell === CellState.FLAGGED) {
        this.setState({ cell: CellState.HIDDEN });
      }
    }
    if (
      prevProps.value !== this.props.value ||
      prevProps.hidden !== this.props.hidden
    ) {
      console.log('diff');
      console.log('hidden: ' + this.props.hidden);
      if (this.props.hidden === false) {
        if (this.props.value === -1) {
          this.setState({ cell: CellState.MINE });
          console.log('bruh?');
        } else {
          this.setState({ cell: this.props.value });
          console.log('bruh2?');
        }
      } else if (this.state.cell !== CellState.FLAGGED) {
        this.setState({ cell: CellState.HIDDEN });
      }
    }
  }
  handleLeftClick() {
    console.log('hewy');
    if (this.state.cell !== CellState.FLAGGED) {
      // Update the cell
      this.props.revealTile(this.props.x, this.props.y);
    }
  }

  handleRightClick(e: React.MouseEvent) {
    e.preventDefault();
    if (this.state.cell === CellState.FLAGGED) {
      this.setState({ cell: CellState.HIDDEN });
    } else if (this.props.hidden) this.setState({ cell: CellState.FLAGGED });
  }

  render() {
    if (this.props.viewOnly === false) {
      return (
        <Button
          variant="text"
          onClick={() => {
            this.handleLeftClick();
          }}
          onContextMenu={(e) => {
            this.handleRightClick(e);
          }}
          sx={{
            padding: '0',
            minWidth: '0',
            border: '1px black solid',
            borderRadius: 0,
          }}
        >
          <this.state.Item>{this.state.cell}</this.state.Item>
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
          <this.state.Item>{this.state.cell}</this.state.Item>
        </Button>
      );
    }
  }
}

export default Cell;
