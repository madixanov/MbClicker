import { useEffect, useState } from "react";
import { fetchAllPlayers } from "../../../services/playerService";
import usePlacementStore from "../../../store/placement-store";
import getTelegramUser from "../../../utils/getTelegramUser";
import PlayerCard from "./PlayerCard"; // вынесем карточку в отдельный файл


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
        setPlayers(sortedPlayers);

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
      {top10.map((player, index) => (
        <PlayerCard key={player.documentId} player={player} index={index} />
      ))}

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
