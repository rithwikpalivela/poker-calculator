import { useState } from "react";
import CardBack from '../images/cardback.png';

const Card = ({value, suit, initVis}) => {
    const [isFaceUp, setIsFaceUp] = useState(initVis);

    let suitIcon, suitColor;
    switch (suit) {
        case "Clubs":
            suitIcon = '♣';
            suitColor = "black";
            break;
        case "Diamonds":
            suitIcon = '♦';
            suitColor = "red";
            break;
        case "Hearts":
            suitIcon = '♥';
            suitColor = "red";
            break;
        case "Spades":
            suitIcon = '♠';
            suitColor = "black";
            break;
        default:
            break;
    }
    
    return (
        <>
            <div onClick={() => setIsFaceUp(!isFaceUp)} style={{
                width: "240px",
                height: "336px",
                border: "2px solid transparent",
                borderRadius: "12px",
                position: "relative",
                background: "white",
                boxShadow: "3px 3px 3px rgba(0,0,0,0.2), 8px 8px 10px rgba(0,0,0,0.2), 0px 0px 20px rgba(0,0,0,0.5)"
            }}>
                {isFaceUp && <h1 style={{
                    fontSize: "50px",
                    color: suitColor,
                    position: "absolute",
                    top: "-10px",
                    left: "5px",
                    margin: "0px"
                }}>
                    {value}
                </h1>}
                {isFaceUp && <p style={{
                    fontSize: "100px",
                    color: suitColor
                }}>
                    {suitIcon}
                </p>}
                {isFaceUp && <h1 style={{
                    fontSize: "50px",
                    color: suitColor,
                    position: "absolute",
                    bottom: "-10px",
                    right: "5px",
                    margin: "0px",
                    transform: "rotate(180deg)"
                }}>
                    {value}
                </h1>}
                {!isFaceUp && <div style={{
                    width: "216px",
                    height: "312px",
                    margin: "10px",
                    border: "2px solid red",
                    borderRadius: "12px",
                    backgroundImage: "url(" + CardBack + ")"
                }}>
                </div>}
            </div>
        </>
    );
};

export default Card;