import './App.css';
import Board from './components/Board';

function App() {
  return (
    <div className="App">
      <div>
        <Board numPlayers={2}/>
      </div>
    </div>
  );
}

export default App;