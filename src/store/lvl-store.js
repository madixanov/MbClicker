import { create } from "zustand";

import useMbStore from "./mb-store";
import getTelegramUser from "../utils/getTelegramUser";
import {
  fetchPlayerByTelegramId,
  updatePlayerWithFallback,
} from "../services/playerService";

const useLvlStore = create((set, get) => ({
  level: 1,
  points: 1024,
  loaded: false,

  // 🔁 Загрузка уровня из Strapi
  loadLevelFromStrapi: async () => {
    const user = getTelegramUser();
    if (!user) return;

    try {
      const player = await fetchPlayerByTelegramId(user.id);

      if (player && typeof player.level === "number") {
        const level = player.level;
        const points = 1024 * 2 ** (level - 1);

        set({ level, points });

        console.log("✅ Синхронизировано: уровень", level, "цель:", points);
      }
    } catch (err) {
      console.error("❌ Ошибка загрузки уровня:", err);
    }
  },

  // ⬆ Повышение уровня + сохранение в Strapi
  upgradeLevel: async () => {
    const { level } = get();
    const newLevel = level + 1;
    const newPoints = 1024 * 2 ** (newLevel - 1);

    set({ level: newLevel, points: newPoints });
    useMbStore.getState().resetCount();

    const user = getTelegramUser();
    if (!user) return;

    try {
      const player = await fetchPlayerByTelegramId(user.id);
      if (!player || !player.documentId) {
        console.warn("⚠️ Игрок не найден или documentId отсутствует");
        return;
      }

      await updatePlayerWithFallback(player.documentId, {
        level: newLevel,
      });

      console.log("🎉 Уровень обновлён в Strapi:", newLevel);
    } catch (err) {
      console.error("❌ Ошибка обновления уровня:", err);
    }
  },
}));

export default useLvlStore;
