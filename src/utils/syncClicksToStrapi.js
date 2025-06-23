import useMbStore from "../store/mb-store";
import getTelegramUser from "../utils/getTelegramUser";
import {
  fetchPlayerByTelegramId,
  updatePlayerClicks,
} from "../services/playerService";

const syncClicksToStrapi = async () => {
  const { mbCountAll } = useMbStore.getState();
  const user = getTelegramUser();

  if (!user) {
    console.warn("❌ Пользователь Telegram не найден");
    return;
  }

  try {
    const player = await fetchPlayerByTelegramId(user.id);

    if (!player || !player.documentId) {
      console.warn("⚠️ Игрок или его documentId не найден");
      return;
    }

    await updatePlayerClicks(player.documentId, mbCountAll);

    console.log("✅ Клики обновлены (ID:", player.documentId, ")");
  } catch (err) {
    console.error("❌ Ошибка при сохранении кликов:", err.response?.data || err);
  }
};

export default syncClicksToStrapi;
