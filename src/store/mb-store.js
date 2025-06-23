import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchPlayerByTelegramId } from '../services/playerService';
import getTelegramUser from '../utils/getTelegramUser';

const useMbStore = create(
  persist(
    (set, get) => ({
      mbCountAll: 0,      // общий счёт (в Strapi)
      mbCount: 0,         // локальный прогресс до следующего уровня
      mbIncrement: 10,    // шаг

      // Увеличить счётчик
      increment: () =>
        set((state) => ({
          mbCountAll: state.mbCountAll + state.mbIncrement,
          mbCount: state.mbCount + state.mbIncrement,
        })),

      // Увеличить инкремент
      incrementMbInc: () =>
        set((state) => ({
          mbIncrement: state.mbIncrement + 1,
        })),

      // Сброс локального счётчика
      resetCount: () =>
        set(() => ({
          mbCount: 0,
        })),

      // 🔁 Загрузка из Strapi
      loadMbFromPlayer: async () => {
        const user = getTelegramUser();
        if (!user) return;

        const player = await fetchPlayerByTelegramId(user.id);
        if (!player) return;

        const clicks = player.clicks ?? 0;

        set({
          mbCountAll: clicks,
        });

        console.log("🔁 Загружены данные из Strapi:", { clicks });
      },
    }),
    {
      name: 'mbCounter-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useMbStore;
