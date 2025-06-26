import { useEffect, useState } from "react";
import { fetchAllPlayers } from "../../../services/playerService";
import usePlacementStore from "../../../store/placement-store";
import getTelegramUser from "../../../utils/getTelegramUser";

const PlayerCard = ({ player, index, isCurrentUser }) => {
  const placement = index + 1;

  const defaultAvatar = `data:image/svg+xml;utf8,
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect fill="white" width="100" height="100"/>
      <circle cx="50" cy="35" r="20" fill="%23ccc"/>
      <rect x="25" y="60" width="50" height="25" rx="10" fill="%23ccc"/>
    </svg>`;

  return (
    <div className={`player-container ${isCurrentUser ? "highlight-player" : ""}`}>
      <div className="placement-player">
        <p className="placement">#{placement}</p>
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
      <p className="balance">{player.clicks?.toLocaleString('ru-RU') || 0}</p>
      <p className="exchanges">0</p>
    </div>
  );
};

const LeadersList = () => {
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentPlacement, setCurrentPlacement] = useState(null);

  const setPlacement = usePlacementStore((state) => state.setPlacement);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const allPlayers = await fetchAllPlayers();

        const sortedPlayers = [...allPlayers].sort((a, b) => b.clicks - a.clicks);

        setPlayers(sortedPlayers); // все игроки

        const userId = getTelegramUser()?.id;

        const index = sortedPlayers.findIndex(p => p.telegram_id === userId);
        if (index !== -1) {
          setCurrentPlacement(index + 1);
          setCurrentPlayer(sortedPlayers[index]);
          setPlacement(index + 1);
        }
      } catch (err) {
        console.error("Ошибка при загрузке игроков:", err);
      }
    };

    loadPlayers();
  }, []);

  const top10 = players.slice(0, 10);

  return (
    <div className="leaders-list">
      {/* 🔟 Показываем только топ-10 */}
      {top10.map((player, index) => (
        <PlayerCard key={player.documentId} player={player} index={index} />
      ))}

      {/* 👤 Показываем текущего игрока, если он не в топ-10 */}
      {currentPlayer && currentPlacement > 10 && (
        <>
          <hr />
          <div className="your-placement-badge">
            Ты на #{currentPlacement} месте из {players.length}
          </div>
          <PlayerCard
            player={currentPlayer}
            index={currentPlacement - 1}
            isCurrentUser={true}
          />
        </>
      )}
    </div>
  );
};

export default LeadersList;
