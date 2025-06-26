import { useEffect, useMemo, useState } from "react";
import players from "../leaders-list";
import { fetchLeaderboardPlayers } from "../../../services/playerService";

const PlayerCard = ({ player, index }) => {
    const placement = index + 1;
    const [ players, setPlayers ] = useState([]);
    const defaultAvatar = `data:image/svg+xml;utf8,
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect fill="white" width="100" height="100"/>
            <circle cx="50" cy="35" r="20" fill="%23ccc"/>
            <rect x="25" y="60" width="50" height="25" rx="10" fill="%23ccc"/>
        </svg>`;

    useEffect(() => {
        const loadPlayers = async () => {
            try {
                const data = await fetchLeaderboardPlayers();
                setPlayers(data);
            } catch (error) {
                console.error("Ошибка при загрузке игроков:", error);
            }
        }

        loadPlayers();
    }, []);

    return (
        <div className="player-container" key={player.name}>
            <div className="placement-player">
                <p className="placement">{placement}</p>
                <div className="player-info">
                    <div className="leaders-photo-container">
                        <img
                                src={player.photo_url || defaultAvatar}
                                alt={player.name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultAvatar;
                                }}
                                style={{ backgroundColor: "white" }}
                            />
                    </div>
                    <p>{player.name}</p>
                </div>
            </div>
            <p className="balance">{player.clicks.toLocaleString('ru-RU')}</p>
            <p className="exchanges">0</p>
        </div>
    );
};

const LeadersList = () => {
    return (
        <div className="leaders-list">
            {players.map((player, index) => (
                <PlayerCard key={player.name} player={player} index={index} />
            ))}
        </div>
    );
};

export default LeadersList;
