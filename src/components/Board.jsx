import Deck from "./Deck";
import Community from "./Community";
import PlayerHands from "./PlayerHands";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Confetti from "react-confetti";
import ConfettiExplosion from "react-confetti-explosion";

const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const orderedValSet = "A23456789TJQKA";
const cardSuits = ["clubs", "diamonds", "hearts", "spades"];

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

function calcHand(cards) {
    const orderedVals = cards.map((card) => card.value)
        .map((val) => val === '10' ? 'T' : val)
        .sort(function(i, j) {
            const iTier = orderedValSet.lastIndexOf(i);
            const jTier = orderedValSet.lastIndexOf(j);

            if (iTier < jTier) {
                return -1;
            }

            if (iTier > jTier) {
                return 1;
            }

            return 0;
        });
    const uniqueVals = new Set(orderedVals);
    const suits = cards.map((card) => card.suit);

    // check for flush
    const flush = new Set(suits).size === 1;

    // check for straight
    let straight = orderedVals.join('') === "2345A";

    if (!straight && uniqueVals.size === orderedVals.length) {
        let counter = 1;

        for (let i = 1; i < orderedVals.length; i++) {
            if (orderedValSet.lastIndexOf(orderedVals[i]) - orderedValSet.lastIndexOf(orderedVals[i - 1]) !== 1) {
                break;
            }

            counter++;
        }

        straight = counter === orderedVals.length;
    }

    // check for royal flush or straight flush
    if (flush && straight) {
        if (orderedVals.join('') === orderedValSet.substring(orderedValSet.length - orderedVals.length)) {
            return {rank: 1, high: [Infinity], kicker: [Infinity]};
        }
        return {rank: 2, high: [orderedVals[orderedVals.length - 1]], kicker: [Infinity]};
    }

    let valCounts = {};
    let maxValCount = 1;
    for (const val of orderedVals) {
        if (!!!valCounts[val]) {
            valCounts[val] = 0;
        }
        valCounts[val]++;
        maxValCount = Math.max(maxValCount, valCounts[val]);
    }

    // check for quads or full house
    if (uniqueVals.size === 2) {
        for (const val in valCounts) {
            if (valCounts[val] === 4) {
                // quads
                return {rank: 3, high: [val], kicker: [Infinity]};
            }
            if (valCounts[val] === 2 || valCounts[val] === 3) {
                // full house
                return {rank: 4, high: [orderedVals[orderedVals.length - 1]], kicker: [orderedVals[0]]};
            }
        }
    }

    // check for flush
    if (flush) {
        return {rank: 5, high: [orderedVals[orderedVals.length - 1]], kicker: orderedVals.slice(0, orderedVals.length - 1)};
    }

    // check for straight
    if (straight) {
        return {rank: 6, high: [orderedVals[orderedVals.length - 1]], kicker: [Infinity]};
    }

    // check for trips (rank 7) or 2 pair (rank 8)
    if (uniqueVals.size === orderedVals.length - 2) {
        if (maxValCount === 3) {
            // trips
            for (const val of orderedVals) {
                if (valCounts[val] === 3) {
                    return {rank: 7, high: [val], kicker: orderedVals.filter((v) => v !== val)};
                }
            }
        }

        // 2 pair
        let lPair = orderedValSet.length;
        let hPair = -1;
        for (const val of orderedVals) {
            if (valCounts[val] === 2) {
                lPair = Math.min(lPair, orderedValSet.lastIndexOf(val));
                hPair = Math.max(hPair, orderedValSet.lastIndexOf(val));
            }
        }
        return {rank: 8, high: [hPair, lPair], kicker: orderedVals.filter((v) => v !== hPair && v !== lPair)};
    }
    
    // check for pair (rank 9)
    if (uniqueVals.size === orderedVals.length - 1) {
        for (const val of orderedVals) {
            if (valCounts[val] > 1) {
                return {rank: 9, high: [val], kicker: orderedVals.filter((v) => v !== val)};
            }
        }
    }

    // check for high card (rank 10)
    if (uniqueVals.size === orderedVals.length) {
        return {rank: 10, high: [orderedVals[orderedVals.length - 1]], kicker: orderedVals.slice(0, orderedVals.length - 1)};
    }

    return "Nathan";
}

function compareHands(cards1, cards2) {
    // royal flush > straight flush > quads > full house > flush > straight > trips > 2 pair > pair > high
    // returns 1 if cards1 is better than cards2, -1 if worse, and 0 if the same
    const hand1 = calcHand(cards1);
    const hand2 = calcHand(cards2);

    if (hand1.rank !== hand2.rank) {
        return hand1.rank < hand2.rank ? 1 : -1;
    }

    if (orderedValSet.lastIndexOf(hand1.high[0]) === orderedValSet.lastIndexOf(hand2.high[0])) {
        if (hand1.high.length > 1 && orderedValSet.lastIndexOf(hand1.high[1]) !== orderedValSet.lastIndexOf(hand2.high[1])) {
            return orderedValSet.lastIndexOf(hand1.high[1]) > orderedValSet.lastIndexOf(hand2.high[1]) ? 1 : -1;
        }

        // look at kickers
        for (let i = hand1.kicker.length - 1; i >= 0; i--) {
            if (hand1.kicker[i] !== hand2.kicker[i]) {
                return orderedValSet.lastIndexOf(hand1.kicker[i]) > orderedValSet.lastIndexOf(hand2.kicker[i]) ? 1 : -1;
            }
        }

        return 0;
    }

    return orderedValSet.lastIndexOf(hand1.high[0]) > orderedValSet.lastIndexOf(hand2.high[0]) ? 1 : -1;
}

function calcBestHand(hand, community) {
    const cardSet = hand.concat(community);

    let bestHand = [];
    for (const val of community) {
        bestHand.push(val);
    }

    for (let i = 0; i < hand.length + community.length - 1; i++) {
        for (let j = i + 1; j < hand.length + community.length; j++) {
            const currHand = cardSet.filter((card, k) => k !== i && k !== j);
            const x = compareHands(currHand, bestHand);

            if (x === 1) {
                bestHand = [];
                for (const val of currHand) {
                    bestHand.push(val);
                }
            }
        }
    }

    return bestHand;
}

const Board = ({numPlayers, endGame}) => {
    const [topCard, setTopCard] = useState(deck[deck.length - 1]);
    const [hands, setHands] = useState();
    const [community, setCommunity] = useState([]);
    const [inGame, setInGame] = useState(false);
    const [turn, setTurn] = useState(0);
    const [winner, setWinner] = useState();
    const [confetti, setConfetti] = useState(false);

    return (
        <>
            <div className="flexbox-container" style={{display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "10px"}}>
                <div className="flex-item">
                    <div className="flexbox-container" style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                        <Deck nextCard={topCard}/>
                        {inGame && <Community gameTurn={turn} cards={community}/>}
                    </div>
                </div>
                <div className="flex-item">
                    {inGame && turn < 3 && <button onClick={() => {
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
                    {inGame && turn === 3 && !!!winner && <button onClick={() => {
                        let bestHand = community;
                        let winnerHand;
                        for (const hand of hands) {
                            const currHand = calcBestHand(hand.slice(0, hand.length - 1), community);
                            const comp = compareHands(currHand, bestHand);

                            if (comp === 1) {
                                winnerHand = hand;
                                bestHand = currHand;
                            } else if (comp === 0) {
                                winnerHand = undefined;
                            }
                        }

                        if (winnerHand) {
                            const winningPlayer = hands.indexOf(winnerHand) === 0 ? "Player" : "CPU " + hands.indexOf(winnerHand);
                            setWinner(winningPlayer);
                            setConfetti(true);
                            toast("The winner is: " + winningPlayer + "!", { autoClose: false, onOpen: endGame });
                        } else {
                            const winningPlayer = "Tie";
                            setWinner(winningPlayer);
                            toast("It was a tie!", { autoClose: false, onOpen: endGame });
                        }
                        }}>
                        Calculate Winner
                    </button>}
                </div>
                <div className="flex-item">
                    {hands && <PlayerHands handList={hands}/>}
                </div>
            </div>
            {confetti && <ConfettiExplosion force={0.6} duration={2500} particleCount={80} width={1000} style={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}} />}
            {/* {!!winner && <Confetti initialVelocityY={-10} />} */}
        </>
    );
};

export default Board;