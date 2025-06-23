import { create } from 'zustand';
import getTelegramUser from '../utils/getTelegramUser';
import { fetchPlayerByTelegramId, updatePlayerWithFallback } from '../services/playerService';
import useLvlStore from './lvl-store';

const useMbStore = create((set, get) => ({
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

    await updatePlayerWithFallback(player.documentId, {
      clicks: newAll,
      progress_tokens: newTokens,
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
      progressTokens: Number(player.progress_tokens) || 0,
    });

    console.log("🔁 Данные игрока загружены:", {
      clicks: player.clicks,
      progressTokens: player.progress_tokens,
    });
  },

  saveTokensToStrapi: async () => {
    const user = getTelegramUser();
    if (!user) return;

    const player = await fetchPlayerByTelegramId(user.id);
    if (!player || !player.documentId) return;

    const { progressTokens } = get();

    await updatePlayerWithFallback(player.documentId, {
      progress_tokens: progressTokens,
    });

    console.log("💾 Прогресс токены сохранены в Strapi:", progressTokens);
  },
}));

export default useMbStore;
