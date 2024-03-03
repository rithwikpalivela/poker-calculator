import Deck from "./Deck";
import Community from "./Community";
import PlayerHands from "./PlayerHands";
import { useState } from "react";

let cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let cardSuits = ["Clubs", "Diamonds", "Hearts", "Spades"];

let deck = shuffle(buildDeck(cardValues, cardSuits));

function buildDeck(values, suits) {
    let deck = [];
    for (const v of values) {
        for (const s of suits) {
            deck.push({value: v, suit: s});
        }
    }

    return deck;
}

function shuffle(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    return cards;
}

function dealHands(numPlayers) {
    let hands = [];

    for (let i = 0; i < numPlayers; i++) {
        hands.push([]);
    }

    for (let i = 0; i < 2 * numPlayers; i++) {
        hands[i % numPlayers].push(deck.pop());
    }

    for (let i = 0; i < numPlayers; i++) {
        hands[i].push((i === 0));
    }

    return hands;
}

const Board = ({numPlayers}) => {
    const [topCard, setTopCard] = useState(deck[deck.length - 1]);
    const [hands, setHands] = useState();
    const [community, setCommunity] = useState([]);
    const [inGame, setInGame] = useState(false);
    const [turn, setTurn] = useState(0);

    return (
        <>
            <div>
                <Deck nextCard={topCard}/>
                {inGame && <Community gameTurn={turn} cards={community}/>}
            </div>
            {inGame && turn < 3 && <button onClick={() => {
                // burn and reveal appropriate number of cards
                deck.pop();

                switch (turn) {
                    case 0:
                        const flopCard1 = deck.pop();
                        const flopCard2 = deck.pop();
                        const flopCard3 = deck.pop();
                        setCommunity(oldCommunity => [...oldCommunity, flopCard1, flopCard2, flopCard3]);
                        break;
                    case 1:
                        const turnCard = deck.pop();
                        setCommunity(oldCommunity => [...oldCommunity, turnCard]);
                        break;
                    case 2:
                        const riverCard = deck.pop();
                        setCommunity(oldCommunity => [...oldCommunity, riverCard]);
                        break;
                    default:
                        break;
                }

                setTurn(turn + 1);
                setTopCard(deck[deck.length - 1]);
            }}>
                Next
            </button>}
            {!inGame && <button onClick={() => {
                setHands(dealHands(numPlayers));
                setTopCard(deck[deck.length - 1]);
                setInGame(true);
                }}>
                Deal Hands
            </button>}
            {hands && <div><PlayerHands handList={hands}/></div>}
        </>
    );
};

export default Board;