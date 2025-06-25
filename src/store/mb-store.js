import { create } from 'zustand';
import getTelegramUser from '../utils/getTelegramUser';
import { fetchPlayerByTelegramId, updatePlayerWithFallback } from '../services/playerService';
import useLvlStore from './lvl-store';

const useMbStore = create((set, get) => ({
  // 📦 Состояния
  mbCountAll: 0,            // Общие клики (глобально)
  mbCount: 0,               // Клики за сессию (локально)
  progressTokens: 0,        // Прогресс до следующего уровня

  // 📈 Формула инкремента
  getMbIncrement: () => {
    const level = useLvlStore.getState().level || 1;
    const increment = 10 + (level - 1);
    return Math.min(increment, 15);
  },

  // 🔁 При клике увеличиваем счётчики
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
  },

  // 🔄 Мгновенная установка счётчика (после получения task.Prize)
  setMbCountAll: (value) => set({ mbCountAll: value }),

  // 🔁 Сброс сессионных данных (при выходе/апгрейде)
  resetCount: () =>
    set({
      mbCount: 0,
      progressTokens: 0,
    }),

  // 📤 Загрузка данных игрока из Strapi
  loadMbFromPlayer: async () => {
    const user = getTelegramUser();
    if (!user) return;

    const player = await fetchPlayerByTelegramId(user.id);
    if (!player) return;

    set({
      mbCountAll: Number(player.clicks) || 0,
      progressTokens: Number(player.progress_tokens) || 0,
    });
  },

  // 💾 Сохранение прогресса игрока в Strapi (используется в автосохранении)
  saveTokensToStrapi: async () => {
    const user = getTelegramUser();
    if (!user) return;

    const player = await fetchPlayerByTelegramId(user.id);
    if (!player || !player.documentId) return;

    const { mbCountAll, progressTokens } = get();

    await updatePlayerWithFallback(player.documentId, {
      clicks: mbCountAll,
      progress_tokens: progressTokens,
    });
  },
}));

export default useMbStore;
