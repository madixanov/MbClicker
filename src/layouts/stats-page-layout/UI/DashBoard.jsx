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
                        <p>БАЛАНС: <span>{player.balance.toLocaleString('ru-RU')}</span></p>
                        <p>ОБМЕНЫ: <span>{player.exchanges.toLocaleString('ru-RU')}</span></p>
                    </div>
                );
            })}
        </div>
    );
};

export default DashBoard;
