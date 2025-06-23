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

      // 🔁 Загрузка уровня из Strapi + пересчёт points
      loadLevelFromStrapi: async () => {
        const user = getTelegramUser();
        if (!user) return;

        try {
          const player = await fetchPlayerByTelegramId(user.id);

          if (player && typeof player.level === "number") {
            const level = player.level;
            const points = 1024 * 2 ** (level - 1); // ⬅ расчёт цели

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
    }),
    {
      name: "lvl-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useLvlStore;
