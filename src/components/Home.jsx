import Board from './Board';
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Home = () => {
    const [inGame, setInGame] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    function handleClick() {
        setGameOver(true);
    }

    const submit = () => {
        if (!gameOver) {
            confirmAlert({
                title: "Warning!",
                message: "A game is currently in progress. Are you sure you would like to start a new game?",
                buttons: [
                {
                    label: "Yes",
                    onClick: () => window.location.reload()
                },
                {
                    label: "No"
                }
                ]
            });
        } else {
            window.location.reload();
        }
    };

    return (
        <>
            <div>
                {!inGame && <h1>Choose game mode:</h1>}
                {!inGame && <button onClick={() => toast("This game mode is currently unavailable.")}>Interactive</button>}
                {!inGame && <button onClick={() => setInGame(true)}>Random</button>}
                {inGame && <Board numPlayers={2} endGame={handleClick} />}
                {inGame && <button onClick={submit}>New Game</button>}
                <ToastContainer style={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "50%"}} />
            </div>
        </>
    );
}

export default Home;