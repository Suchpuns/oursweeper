import React, { useEffect } from 'react';
import './css/GameVersus.css';
import Board from './Board';
import { BoardAttributes, CellAttributes } from './Helpers';
import { roomInfoState, RoomInfo } from '../recoil_state';
import { useRecoilState, useRecoilValue } from 'recoil';

type GameAttributes = {
  boards: Record<string, CellAttributes[][]>;
  difficulty: number;
  revealTile: (x: number, y: number) => void;
};

const GameVersus = ({ difficulty, revealTile, boards }: GameAttributes) => {
  let roomInfo = useRecoilValue(roomInfoState);
  useEffect(() => {
    console.log('yo');
    console.log(boards);
    return;
  }, [boards]);
  return (
    <div>
      <div className="boards">
        <div className="mainBoard">
          <Board
            difficulty={difficulty}
            revealTile={revealTile}
            viewOnly={false}
          />
        </div>
        {Object.keys(boards).length > 1 ? (
          <div className="otherBoards">
            {Object.keys(boards).map((username, index) => {
              if (username !== roomInfo.username) {
                return (
                  <div className="otherBoard">
                    <h4>{username}</h4>
                    <Board
                      key={index}
                      difficulty={difficulty}
                      revealTile={revealTile}
                      viewOnly={true}
                      board={boards[username]}
                    />
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default GameVersus;
