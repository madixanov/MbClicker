import useMbStore from "../store/mb-store";
import usePlayerStore from "../store/player-store";
import { updatePlayer } from "../services/playerService";

const syncClicksToStrapi = async () => {
  const { mbCountAll } = useMbStore.getState();
  const { player } = usePlayerStore.getState();

  const playerDocumentId = player?.documentId;

  if (!playerDocumentId) {
    console.warn("❌ Нет documentId — не сохраняем клики");
    return;
  }

  if (typeof mbCountAll !== "number" || mbCountAll <= 0) {
    console.warn("⚠️ mbCountAll = 0 или невалиден — пропускаем", mbCountAll);
    return;
  }

  try {
    console.log("💾 Сохраняем клики:", mbCountAll);
    await updatePlayer(playerDocumentId, { clicks: mbCountAll });
    console.log("✅ Клики сохранены (ID:", playerDocumentId, ")");
  } catch (err) {
    console.error("❌ Ошибка при сохранении кликов:", err.response?.data || err);
  }
};

export default syncClicksToStrapi;
