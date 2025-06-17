import players from "../leaders-list";

const LeadersList = () => {
    const sortedByBalance = [...players].sort((a, b) => b.balance - a.balance);

    return (
        <div className="leaders-list">
            {sortedByBalance.map((player, index) => {
                const placement = index + 1;

                return (
                    <div key={player.name} className="player-container">
                        <div className="placement-player">
                            <p className="placement">{placement}</p>
                            <div className="player-info">
                                <div className="leaders-photo-container">
                                    <img src={player.img} alt={player.name} />
                                </div>
                                <p>{player.name}</p>
                            </div>
                        </div>
                        <p className="balance">{player.balance.toLocaleString('ru-RU')}</p>
                        <p className="exchanges">{player.exchanges.toLocaleString('ru-RU')}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default LeadersList;
