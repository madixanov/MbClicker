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
            const playerId = players[0].id;

            // 2. Обновим в Strapi level и points
            await axios.put(`https://mbclickerstrapi.onrender.com/api/players/${playerId}`, {
              data: {
                level: newLevel,
                points: newPoints,
              },
            });

            console.log("✅ Уровень и очки обновлены в Strapi:", {
              level: newLevel,
              points: newPoints,
            });
          }
        } catch (err) {
          console.error("❌ Ошибка при обновлении данных в Strapi:", err);
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
