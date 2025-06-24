import getTelegramUser from "../utils/getTelegramUser";
import { fetchPlayerByTelegramId, updatePlayer } from "../services/playerService";

const useUpdatePlayer = () => {
  return async (fields) => {
    const user = getTelegramUser();

    const player = await fetchPlayerByTelegramId(user.id);

    try {
      await updatePlayer(player.documentId, fields);
    } catch (err) {
      console.error("❌ Ошибка при обновлении игрока:", err.response?.data || err);
    }
  };
};

export default useUpdatePlayer;
