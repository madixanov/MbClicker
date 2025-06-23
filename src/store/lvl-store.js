import { create } from "zustand";
import { persist } from "zustand/middleware";
import useMbStore from "./mb-store";
import getTelegramUser from "../utils/getTelegramUser";
import {
  fetchPlayerByTelegramId,
  updatePlayerLevel,
} from "../services/playerService";

const useLvlStore = create(
  persist(
    (set, get) => ({
      level: 1,
      points: 1024,

      // Загрузка уровня с сервера
      loadLevelFromStrapi: async () => {
        const user = getTelegramUser();
        if (!user) return;

        const player = await fetchPlayerByTelegramId(user.id);
        if (!player || !player.level) {
          console.warn("⚠️ Игрок не найден или уровень не задан");
          return;
        }

        set({ level: player.level });
        console.log("✅ Уровень загружен из Strapi:", player.level);
      },

      // Повышение уровня
      upgradeLevel: async () => {
        const { level, points } = get();
        const newLevel = level + 1;
        const newPoints = points * 2;

        const user = getTelegramUser();
        if (!user) return;

        const player = await fetchPlayerByTelegramId(user.id);
        if (!player || !player.documentId) {
          console.warn("⚠️ Игрок или documentId не найден");
          return;
        }

        try {
          await updatePlayerLevel(player.documentId, newLevel);

          // ✅ После успешного обновления — сохраняем локально
          set({ level: newLevel, points: newPoints });

          // Сброс кликов
          useMbStore.getState().resetCount();

          console.log("✅ Уровень обновлён в Strapi и локально:", newLevel);
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
