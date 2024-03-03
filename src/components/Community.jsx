import Card from "./Card";

const Community = ({cards}) => {
    const cardSet = cards.map(card => {
        return (
            <div>
                <Card value={card.value} suit={card.suit} initVis={true} />
            </div>
        );
    });

    return (
        <>
            <div className="flexbox-container" style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                {cardSet}
            </div>
        </>
    );
};

export default Community;