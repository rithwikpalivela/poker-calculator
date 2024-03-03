import Card from './Card';

const Deck = ({nextCard}) => {
    return (
        <>
            <div>
                <Card value={nextCard.value} suit={nextCard.suit} initVis={false} />
            </div>
        </>
    );
};

export default Deck;