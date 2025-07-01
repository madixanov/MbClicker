import { create } from 'zustand';
import getTelegramUser from '../utils/getTelegramUser';
import { fetchPlayerByTelegramId, updatePlayer, updatePlayerWithFallback } from '../services/playerService';
import useLvlStore from './lvl-store';

const useMbStore = create((set, get) => ({
  // 📦 Состояния
  mbCountAll: 0,            // Общие клики (глобально)
  mbCount: 0,               // Клики за сессию (локально)
  progressTokens: 0,        // Прогресс до следующего уровня
  inviteCode: '',           // Реферальный код
  isProcessing: false,      // Флаг для отслеживания операций

  // 🔄 Установка реферального кода с валидацией
  setInviteCode: (value) => {
    if (typeof value === 'string' && value.trim() !== '') {
      set({ inviteCode: value.trim() });
      localStorage.setItem('pendingInviteCode', value.trim());
    }
  },

  // 📈 Формула инкремента (мемоизированная)
  getMbIncrement: () => {
    const level = useLvlStore.getState().level || 1;
    const baseIncrement = 10;
    const levelBonus = Math.min(level - 1, 5); // Максимум +5 за уровни
    return baseIncrement + levelBonus;
  },

  // 🔁 Оптимизированная функция инкремента
  increment: async () => {
    const { getMbIncrement, mbCountAll, mbCount, progressTokens } = get();
    const increment = getMbIncrement();
    
    const newState = {
      mbCountAll: mbCountAll + increment,
      mbCount: mbCount + increment,
      progressTokens: progressTokens + increment,
    };

    set(newState);
  },

  // 🔄 Установка общего количества кликов
  setMbCountAll: (value) => {
    if (typeof value === 'number' && value >= 0) {
      set({ mbCountAll: value });
    }
  },

  // 🔄 Сброс сессионных данных
  resetCount: () => set({ mbCount: 0, progressTokens: 0 }),

  // 📤 Загрузка данных игрока с обработкой ошибок
  loadMbFromPlayer: async () => {
    set({ isProcessing: true });
    try {
      const user = getTelegramUser();
      if (!user) return;

      const player = await fetchPlayerByTelegramId(user.id);
      if (player) {
        set({
          mbCountAll: Number(player.clicks) || 0,
          progressTokens: Number(player.progress_tokens) || 0,
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки данных игрока:', error);
    } finally {
      set({ isProcessing: false });
    }
  },

  // 💾 Оптимизированное автосохранение
  saveTokensToStrapi: async () => {
    if (get().isProcessing) return;
    
    set({ isProcessing: true });
    try {
      const user = getTelegramUser();
      if (!user) return;

      const player = await fetchPlayerByTelegramId(user.id);
      if (player?.documentId) {
        const { mbCountAll, progressTokens } = get();
        await updatePlayer(player.documentId, {
          clicks: mbCountAll,
          progress_tokens: progressTokens,
        });
      }
    } catch (error) {
      console.error('Ошибка автосохранения:', error);
    } finally {
      set({ isProcessing: false });
    }
  },
}));

export default useMbStore;