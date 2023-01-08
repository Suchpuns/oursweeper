import React from 'react';
import './css/TitleText.css';

const TitleText = () => {
  const title = 'Oursweeper';

  const mines = '3421638212';

  const titleArray: String[] = [];
  for (let index = 0; index < title.length; index++) {
    titleArray.push(title[index]);
  }

  const minesArray: String[] = [];
  for (let index = 0; index < mines.length; index++) {
    minesArray.push(mines[index]);
  }
  minesArray[4] = '🚩';
  minesArray[1] = '🚩';
  minesArray[9] = '🚩';
  return (
    <div>
      <meta charSet="UTF-8"></meta>
      <div className="title">
        <p className="word">
          {titleArray.map((letter) => {
            return <span className="letter">{letter}</span>;
          })}
        </p>
        <p className="mines">
          {minesArray.map((mine) => {
            return <span className="mine">{mine}</span>;
          })}
        </p>
        <a className="start-btn" href="/game">
          Play
        </a>
      </div>
    </div>
  );
};

export default TitleText;
