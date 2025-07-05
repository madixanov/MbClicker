import { useState, useEffect } from "react";
import getTelegramUser from "../utils/getTelegramUser";
import { fetchPlayerByTelegramId } from "../services/playerService";
import usePlayerStore from "../store/player-store";

let isLoading = false; // 🔒 глобальный флаг, предотвращающий повторные вызовы

const usePlayerData = () => {
  const { player, setPlayer } = usePlayerStore();
  const [loading, setLoading] = useState(!player);
  const [error, setError] = useState(null);

  const loadPlayer = async () => {
    if (isLoading) return;
    isLoading = true;

    const user = getTelegramUser();
    if (!user) {
      setLoading(false);
      isLoading = false;
      return;
    }

    try {
      console.log("🚀 Загрузка игрока по Telegram ID...");
      
      // 👉 Попробуем найти в localStorage (опционально)
      const cachedDocumentId = localStorage.getItem("playerDocumentId");
      if (player?.documentId || cachedDocumentId) {
        console.log("📦 Игрок уже загружен или найден в кеше");
        setLoading(false);
        isLoading = false;
        return;
      }

      const playerData = await fetchPlayerByTelegramId(user.id);

      if (playerData) {
        setPlayer(playerData);
        localStorage.setItem("playerDocumentId", playerData.documentId); // 💾 кэшируем
      } else {
        console.warn("⚠️ Игрок не найден в Strapi");
        setPlayer(null);
      }
    } catch (err) {
      console.error("❌ Ошибка при получении игрока:", err);
      setError(err);
    } finally {
      setLoading(false);
      isLoading = false;
    }
  };

  useEffect(() => {
    console.log("🧠 usePlayerData подключен");
  }, []);

  return { player, setPlayer, loadPlayer, loading, error };
};

export default usePlayerData;
