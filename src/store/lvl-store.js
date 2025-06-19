import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import useMbStore from "./mb-store"; // путь подкорректируй под свой проект

// Получить Telegram user
const getTelegramUser = () => {
  const tg = window.Telegram?.WebApp;
  return tg?.initDataUnsafe?.user || null;
};

const useLvlStore = create(
  persist(
    (set, get) => ({
      level: 1,
      points: 1024,

      upgradeLevel: async () => {
        const prevState = get();
        const newLevel = prevState.level + 1;
        const newPoints = prevState.points * 2;

        // 🔄 Обновляем локальное состояние
        set({
          level: newLevel,
          points: newPoints,
        });

        // 🔄 Сброс mbCount после повышения уровня
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

            await axios.put(
              `https://mbclickerstrapi.onrender.com/api/players/document/${playerDocId}`,
              {
                data: {
                  level: newLevel,
                },
              }
            );

            console.log("✅ Уровень обновлён в Strapi:", newLevel);
          }
        } catch (err) {
          console.error("❌ Ошибка при обновлении уровня в Strapi:", err);
        }
      },

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
            const level = players[0].level ?? 1;
            set({ level });
            console.log("✅ Уровень загружен из Strapi:", level);
          }
        } catch (err) {
          console.error("❌ Ошибка при загрузке уровня из Strapi:", err);
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
