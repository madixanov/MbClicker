import getTelegramUser from "../utils/getTelegramUser";
import { fetchPlayerByTelegramId, updatePlayer } from "../services/playerService";

const useUpdatePlayer = () => {
  return async (fields) => {
    const user = getTelegramUser();
    if (!user) {
      console.warn("❌ Пользователь Telegram не найден");
      return;
    }

    const player = await fetchPlayerByTelegramId(user.id);

    if (!player || !player.documentId) {
      console.warn("⚠️ Игрок не найден или нет documentId");
      return;
    }

    try {
      await updatePlayer(player.documentId, {
        data: fields
      });
      console.log("✅ Игрок обновлён:", fields);
    } catch (err) {
      console.error("❌ Ошибка при обновлении игрока:", err.response?.data || err);
    }
  };
};

export default useUpdatePlayer;
