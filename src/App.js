import './App.css';
import Board from './components/Board';
import { useState } from "react";

function App() {
  const [inGame, setInGame] = useState(false);

  return (
    <div className="App">
      {!inGame && <h1>Choose game mode:</h1>}
      {!inGame && <button>Interactive</button>}
      {!inGame && <button onClick={() => setInGame(true)}>Random</button>}
      {inGame && <Board numPlayers={2}/>}
      {inGame && <button onClick={() => window.location.reload()}>New Game</button>}
    </div>
  );
}

export default App;