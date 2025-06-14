import dashboard from "../dashboard";

const DashBoard = () => {
    const sortedPlayers = [...dashboard].sort((a, b) => b.balance - a.balance);

    return (
        <div className="dash-board">
            {sortedPlayers.map((player, index) => {
                let cardClass = "profile-card";
                let imgClass = "pfp-container";

                if (index === 0) {
                    cardClass += " top-card";
                    imgClass += " top-player-img";
                } else if (index === 1) {
                    cardClass += " second-card";
                    imgClass += " second-player-img";
                }

                return (
                    <div key={player.name} className={cardClass}>
                        <div className={imgClass}>
                            <img src={player.img} alt={player.name} />
                        </div>
                        <h2>{player.name}</h2>
                        <p>BALANCE: <span>{player.balance}</span></p>
                        <p>EXCHANGES: <span>{player.exchanges}</span></p>
                    </div>
                );
            })}
        </div>
    );
};

export default DashBoard;
