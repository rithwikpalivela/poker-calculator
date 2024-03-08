import Hand from "./Hand";

const PlayerHands = ({handList}) => {
    const hands = handList.map(hand => {
        return (
            <div className="flex-item">
                <Hand val1={hand[0].value} suit1={hand[0].suit} val2={hand[1].value} suit2={hand[1].suit} vis={hand[2]} />
            </div>
        );
    });

    return (
        <>
            <div className="flexbox-container" style={{display: "flex", flexFlow: "row wrap", justifyContent: "space-around", gap: "10px"}}>
                {hands}
            </div>
        </>
    );
};

export default PlayerHands;