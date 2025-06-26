import { useEffect, useState } from "react";
import { fetchLeaderboardPlayers } from "../../../services/playerService";
import usePlacementStore from "../../../store/placement-store";
import getTelegramUser from "../../../utils/getTelegramUser";

const PlayerCard = ({ player, index }) => {
    const placement = index + 1;
    const p = player.attributes;

    const defaultAvatar = `data:image/svg+xml;utf8,
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect fill="white" width="100" height="100"/>
            <circle cx="50" cy="35" r="20" fill="%23ccc"/>
            <rect x="25" y="60" width="50" height="25" rx="10" fill="%23ccc"/>
        </svg>`;

    return (
        <div className="player-container" key={p.name}>
            <div className="placement-player">
                <p className="placement">{placement}</p>
                <div className="player-info">
                    <div className="leaders-photo-container">
                        <img
                            src={p.photo_url || defaultAvatar}
                            alt={p.name}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultAvatar;
                            }}
                            style={{ backgroundColor: "white" }}
                        />
                    </div>
                    <p>{p.name}</p>
                </div>
            </div>
            <p className="balance">{p.clicks?.toLocaleString('ru-RU') || 0}</p>
            <p className="exchanges">0</p>
        </div>
    );
};

const LeadersList = () => {
    const [players, setPlayers] = useState([]);
    const setPlacement = usePlacementStore((state) => state.setPlacement);

    useEffect(() => {
        const loadPlayers = async () => {
            try {
                const data = await fetchLeaderboardPlayers();
                setPlayers(data);

                const telegramId = getTelegramUser()?.id;

                const currentIndex = data.findIndex(
                    (p) => p.attributes?.telegramId === telegramId
                );

                if (currentIndex !== -1) {
                    setPlacement(currentIndex + 1); // 1-based индекс
                }
            } catch (error) {
                console.error("Ошибка при загрузке игроков:", error);
            }
        };

        loadPlayers();
    }, []);

    return (
        <div className="leaders-list">
            {players.map((player, index) => (
                <PlayerCard key={player.id} player={player} index={index} />
            ))}
        </div>
    );
};

export default LeadersList;
