import { useMemo } from "react";
import players from "../leaders-list";

const PlayerCard = ({ player, index }) => {
    const placement = index + 1;

    return (
        <div className="player-container" key={player.name}>
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
};

const LeadersList = () => {
    const sortedByBalance = useMemo(
        () => [...players].sort((a, b) => b.balance - a.balance),
        []
    );

    return (
        <div className="leaders-list">
            {sortedByBalance.map((player, index) => (
                <PlayerCard key={player.name} player={player} index={index} />
            ))}
        </div>
    );
};

export default LeadersList;
