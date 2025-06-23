import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchPlayerByTelegramId } from '../services/playerService';
import getTelegramUser from '../utils/getTelegramUser';
import useLvlStore from './lvl-store'; // импорт уровня

const useMbStore = create(
  persist(
    (set, get) => ({
      mbCountAll: 0,
      mbCount: 0,

      // ← динамический инкремент
      increment: () => {
        const level = useLvlStore.getState().level || 1;
        const mbIncrement = 10 + (level - 1);

        set((state) => ({
          mbCountAll: state.mbCountAll + mbIncrement,
          mbCount: state.mbCount + mbIncrement,
        }));
      },

      // ← геттер инкремента
      getMbIncrement: () => {
        const level = useLvlStore.getState().level || 1;
        return 10 + level;
      },

      resetCount: () => set(() => ({ mbCount: 0 })),

      loadMbFromPlayer: async () => {
        const user = getTelegramUser();
        if (!user) return;

        const player = await fetchPlayerByTelegramId(user.id);
        if (!player) return;

        const clicks = Number(player.clicks) || 0;
        set({ mbCountAll: clicks });

        console.log("🔁 Загружены данные из Strapi:", { clicks });
      },
    }),
    {
      name: "mbCounter-storage",
      getStorage: () => localStorage,
    }
  )
);


export default useMbStore;
