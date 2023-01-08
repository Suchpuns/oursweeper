import Cell from './components/Cell';
import Board from './components/Board';
import Rooms from './components/Rooms';
import TitleText from './components/TitleText';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Fragment } from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<TitleText />}></Route>
          <Route path="/game" element={<Rooms />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
