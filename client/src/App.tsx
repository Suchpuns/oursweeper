import Cell from './components/Cell';
import Board from './components/Board';
import Rooms from './components/Rooms';
import { Fragment } from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* <Board difficulty={0} /> */}
      <Rooms />
    </div>
  );
}

export default App;
