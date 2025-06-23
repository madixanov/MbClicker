import { create } from "zustand";
import { persist } from "zustand/middleware";

import useMbStore from "./mb-store";
import getTelegramUser from "../utils/getTelegramUser";
import {
  fetchPlayerByTelegramId,
  updatePlayerWithFallback,
} from "../services/playerService";
import { calculatePoints } from "../utils/levelUtils";

const useLvlStore = create(
  persist(
    (set, get) => ({
      level: 1,
      points: calculatePoints(1),

      // Загрузка уровня из Strapi
      loadLevelFromStrapi: async () => {
        const user = getTelegramUser();
        if (!user) return;

        try {
          const player = await fetchPlayerByTelegramId(user.id);
          if (player && player.level !== undefined) {
            const level = player.level;
            const points = calculatePoints(level);
            set({ level, points });

            console.log("✅ Уровень загружен из Strapi:", level);
          }
        } catch (err) {
          console.error("❌ Ошибка при загрузке уровня:", err);
        }
      },

      // Повышение уровня
      upgradeLevel: async () => {
        const { level } = get();
        const newLevel = level + 1;
        const newPoints = calculatePoints(newLevel);

        // Локальное обновление
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
