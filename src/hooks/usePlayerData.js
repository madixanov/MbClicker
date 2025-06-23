import { useState, useEffect } from "react";
import getTelegramUser from "../utils/getTelegramUser";
import { fetchPlayerByTelegramId } from "../services/playerService";

const usePlayerData = () => {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      const user = getTelegramUser();

      if (!user) {
        console.warn("❌ Пользователь Telegram не найден");
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

    fetchPlayer();
  }, []);

  return { player, loading, error };
};

export default usePlayerData;
