import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import useMbStore from "./mb-store"; // путь к своему mb-store

// Получить Telegram user из WebApp
const getTelegramUser = () => {
  const tg = window.Telegram?.WebApp;
  return tg?.initDataUnsafe?.user || null;
};

const useLvlStore = create(
  persist(
    (set, get) => ({
      level: 1,
      points: 1024,

      // Загружаем уровень и очки с сервера
      loadLevelFromStrapi: async () => {
        const user = getTelegramUser();
        if (!user) return;

        const telegram_id = user.id;

        try {
          const res = await axios.get(
            `https://mbclickerstrapi.onrender.com/api/players?filters[telegram_id][$eq]=${telegram_id}`
          );

          const players = res.data.data;

          if (players.length > 0) {
            const player = players[0];

            const strapiLevel = player.level ?? 1;

            // Устанавливаем состояние точно по Strapi
            set({ level: strapiLevel });

            console.log("✅ Загружено из Strapi:", strapiLevel);
          }
        } catch (err) {
          console.error("❌ Ошибка при загрузке из Strapi:", err);
        }
      },

      // Повышение уровня
      upgradeLevel: async () => {
        const { level, points } = get();
        const newLevel = level + 1;
        const newPoints = points * 2;

        // Обновляем локально
        set({ level: newLevel, points: newPoints });

        // Сбрасываем клики
        const resetCount = useMbStore.getState().resetCount;
        resetCount();

        const user = getTelegramUser();
        if (!user) return;

        const telegram_id = user.id;

        try {
          const res = await axios.get(
            `https://mbclickerstrapi.onrender.com/api/players?filters[telegram_id][$eq]=${telegram_id}`
          );

          const players = res.data.data;

          if (players.length > 0) {
            const playerDocId = players[0].documentId;

            // Обновляем всё состояние через PUT
            await axios.put(
              `https://mbclickerstrapi.onrender.com/api/players/${playerDocId}`,
              {data: {
                level: newLevel,
              }
              }
            );

            console.log("✅ Обновлено в Strapi:", newLevel, newPoints);
          }
        } catch (err) {
          console.error("❌ Ошибка при обновлении в Strapi:", err);
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
