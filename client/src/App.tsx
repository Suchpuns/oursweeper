import Cell from './components/Cell';
import Board from './components/Board';
import { Fragment } from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <Board difficulty={0} />
    </div>
  );
}

export default App;
