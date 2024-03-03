import Card from "./Card";

const Hand = ({val1, suit1, val2, suit2, vis}) => {
    return (
        <>
            <div className="flexbox-container" style={{display: "flex", flexDirection: "row"}}>
                <div>
                    <Card value={val1} suit={suit1} initVis={vis} />
                </div>
                <div>
                    <Card value={val2} suit={suit2} initVis={vis} />
                </div>
            </div>
        </>
    );
};

export default Hand;