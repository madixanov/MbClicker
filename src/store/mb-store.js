import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import getTelegramUser from '../utils/getTelegramUser';
import { fetchPlayerByTelegramId, updatePlayerWithFallback } from '../services/playerService';
import useLvlStore from './lvl-store';

const useMbStore = create(
  persist(
    (set, get) => ({
      mbCountAll: 0,
      mbCount: 0,
      progressTokens: 0,

      getMbIncrement: () => {
        const level = useLvlStore.getState().level || 1;
        return 10 + (level - 1);
      },

      increment: async () => {
        const increment = get().getMbIncrement();
        const newAll = get().mbCountAll + increment;
        const newLocal = get().mbCount + increment;
        const newTokens = get().progressTokens + increment;

        set({
          mbCountAll: newAll,
          mbCount: newLocal,
          progressTokens: newTokens,
        });

        const user = getTelegramUser();
        if (!user) return;

        const player = await fetchPlayerByTelegramId(user.id);
        if (!player || !player.documentId) return;

        // Обновляем clicks и токены в Strapi
        await updatePlayerWithFallback(player.documentId, {
          clicks: newAll,
          progressTokens: newTokens,
        });
      },

      resetCount: () =>
        set({
          mbCount: 0,
          progressTokens: 0,
        }),

      loadMbFromPlayer: async () => {
        const user = getTelegramUser();
        if (!user) return;

        const player = await fetchPlayerByTelegramId(user.id);
        if (!player) return;

        set({
          mbCountAll: Number(player.clicks) || 0,
          progressTokens: Number(player.progressTokens) || 0,
        });

        console.log("🔁 Данные игрока загружены:", {
          clicks: player.clicks,
          progressTokens: player.progressTokens,
        });
      },
    }),
    {
      name: 'mbCounter-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useMbStore;
