import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

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

      // 🔁 Повышение уровня + удвоение очков + синхронизация
      upgradeLevel: async () => {
        const prevState = get();
        const newLevel = prevState.level + 1;
        const newPoints = prevState.points * 2;

        // Обновить локально
        set({
          level: newLevel,
          points: newPoints,
        });

        const user = getTelegramUser();
        if (!user) return;

        const telegram_id = user.id;

        try {
          // 1. Найдём игрока
          const res = await axios.get(`https://mbclickerstrapi.onrender.com/api/players?filters[telegram_id][$eq]=${telegram_id}`);
          const players = res.data.data;

          if (players.length > 0) {
            const playerId = players[0].documentId;

            console.log("⏳ Отправка данных в Strapi:", {
                id: playerId,
                payload: {
                    data: {
                    level: newLevel, // ← только это поле, если points не используется
                    },
                },
                });


            // 2. Обновим в Strapi level и points
            await axios.put(`https://mbclickerstrapi.onrender.com/api/players/${playerId}`, {
              data: {
                level: newLevel,
              },
            });

            console.log("✅ Уровень и очки обновлены в Strapi:", {
              level: newLevel,
            });
          }
        } catch (err) {
          console.error("❌ Ошибка при обновлении данных в Strapi:", err);
        }
      },

      loadLevelFromStrapi: async () => {
        const user = getTelegramUser();
        if (!user) return;

        const documentId = user.id;

        try {
          const res = await axios.get(
            `https://mbclickerstrapi.onrender.com/api/players?filters[documentId][$eq]=${documentId}`
          );
          const players = res.data.data;

          if (players.length > 0) {
            const level = players[0].attributes?.level ?? 1;
            set({ level });
            console.log("✅ Уровень загружен из Strapi:", level);
          }
        } catch (err) {
          console.error("❌ Ошибка при загрузке уровня из Strapi:", err);
        }
      },

      // Оставим, если хочешь вручную удваивать (опционально)
      upgradePoints: () => set((state) => ({
        points: state.points * 2
      })),
    }),
    {
      name: "lvl-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useLvlStore;
