import useMbStore from "../store/mb-store";
import { updatePlayer } from "../services/playerService";

const syncClicksToStrapi = async () => {
  const { mbCountAll, playerDocumentId } = useMbStore.getState();

  if (!playerDocumentId) {
    console.warn("❌ Нет playerDocumentId — невозможно сохранить клики");
    return;
  }

  if (typeof mbCountAll !== "number" || mbCountAll <= 0) {
    console.warn("⚠️ mbCountAll невалиден или 0 — пропускаем сохранение:", mbCountAll);
    return;
  }

  try {
    console.log("💾 Автосейв кликов:", mbCountAll);
    await updatePlayer(playerDocumentId, { clicks: mbCountAll });
    console.log("✅ Клики успешно сохранены в Strapi (ID:", playerDocumentId, ")");
  } catch (err) {
    console.error("❌ Ошибка при сохранении кликов:", err.response?.data || err);
  }
};

export default syncClicksToStrapi;
