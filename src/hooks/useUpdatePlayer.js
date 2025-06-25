import getTelegramUser from "../utils/getTelegramUser";
import { fetchPlayerByTelegramId, updatePlayer } from "../services/playerService";
import usePlayerData from "./usePlayerData";
import useMbStore from "../store/mb-store"; // хранилище кликов и токенов

const useUpdatePlayer = () => {
  const { setPlayer } = usePlayerData(); // для обновления игрока в Zustand
  const resetMbStore = useMbStore.getState(); // методы из mb-store

  return async (fields) => {
    const user = getTelegramUser();
    if (!user?.id) return;

    const player = await fetchPlayerByTelegramId(user.id);
    if (!player) {
      console.warn("Игрок не найден");
      return;
    }

    try {
      // ✅ Обновляем игрока в Strapi
      await updatePlayer(player.documentId, fields);

      // 🔁 Загружаем свежие данные
      const updatedPlayer = await fetchPlayerByTelegramId(user.id);
      if (updatedPlayer) setPlayer(updatedPlayer);

      // 🧹 Обнуляем счётчики, если были сброшены на сервере
      const resetClicks = fields.clicks === 0;
      const resetTokens = fields.progress_tokens === 0;

      if (resetClicks || resetTokens) {
        useMbStore.setState({
          mbCountAll: resetClicks ? 0 : resetMbStore.mbCountAll,
          progressTokens: resetTokens ? 0 : resetMbStore.progressTokens,
        });
      }

    } catch (err) {
      console.error("❌ Ошибка при обновлении игрока:", err.response?.data || err);
    }
  };
};

export default useUpdatePlayer;
