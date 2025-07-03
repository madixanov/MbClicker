import { useState, useEffect } from "react";
import getTelegramUser from "../utils/getTelegramUser";
import { fetchPlayerByTelegramId } from "../services/playerService";
import usePlayerStore from "../store/player-store";

const usePlayerData = () => {
  const { player, setPlayer } = usePlayerStore();
  const [loading, setLoading] = useState(!player);
  const [error, setError] = useState(null);

  const loadPlayer = async () => {
    const user = getTelegramUser();
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const playerData = await fetchPlayerByTelegramId(user.id);

      if (playerData) {
        setPlayer(playerData);
      } else {
        console.warn("⚠️ Игрок не найден в Strapi");
        setPlayer(null);
      }
    } catch (err) {
      console.error("❌ Ошибка при получении игрока:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { player, setPlayer, loadPlayer, loading, error };
};

export default usePlayerData;
