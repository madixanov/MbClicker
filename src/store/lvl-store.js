import { create } from "zustand";
import { persist } from "zustand/middleware";

import useMbStore from "./mb-store";
import getTelegramUser from "../utils/getTelegramUser";
import {
  fetchPlayerByTelegramId,
  updatePlayerWithFallback,
} from "../services/playerService";

const useLvlStore = create(
  persist(
    (set, get) => ({
      level: 1,
      points: 1024,

      // Загрузка уровня из Strapi
      loadLevelFromStrapi: async () => {
        const user = getTelegramUser();
        if (!user) return;

        try {
          const player = await fetchPlayerByTelegramId(user.id);
          if (player && player.level !== undefined) {
            set({ level: player.level });
            console.log("✅ Уровень загружен из Strapi:", player.level);
          }
        } catch (err) {
          console.error("❌ Ошибка при загрузке уровня:", err);
        }
      },

      // Повышение уровня и обновление на сервере
      upgradeLevel: async () => {
        const { level, points } = get();
        const newLevel = level + 1;
        const newPoints = points * 2;

        // Локально
        set({ level: newLevel, points: newPoints });

        // Сброс кликов
        useMbStore.getState().resetCount();

        const user = getTelegramUser();
        if (!user) return;

        try {
          const player = await fetchPlayerByTelegramId(user.id);
          if (!player || !player.documentId) {
            console.warn("⚠️ Игрок не найден или нет documentId");
            return;
          }

          await updatePlayerWithFallback(player.documentId, {
            level: newLevel,
          });

          console.log("✅ Уровень обновлён в Strapi:", newLevel);
        } catch (err) {
          console.error("❌ Ошибка при обновлении уровня:", err);
        }
      },
    }),
    {
      name: "lvl-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useLvlStore;
