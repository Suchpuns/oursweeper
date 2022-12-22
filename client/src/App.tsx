import Cell from "./Cell";
import Board from "./Board";
import { Fragment } from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Board difficulty={0} />
    </div>
  );
}

export default App;
