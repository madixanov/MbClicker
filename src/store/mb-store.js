// store/mb-store.ts или .js

import { create } from "zustand";
import getTelegramUser from "../utils/getTelegramUser";
import { fetchPlayerByTelegramId, updatePlayer } from "../services/playerService";
import useLvlStore from "./lvl-store";
import usePlayerStore from "./player-store";

const useMbStore = create((set, get) => ({
  // 📦 Состояния
  mbCountAll: 0,
  mbCount: 0,
  progressTokens: 0,
  inviteCode: "",
  isProcessing: false,
  loaded: false, // ✅ Чтобы не загружать повторно
  isSaving: false,

  startSavingAvatar: () => set({ isSavingAvatar: true }),
  stopSavingAvatar: () => set({ isSavingAvatar: false }),

  // 📦 Инициализация (автозагрузка один раз)
  initMbStore: () => {
    const { loaded, loadMbFromPlayer } = get();
    if (!loaded) loadMbFromPlayer();
  },

  // 🔄 Установка реферального кода
  setInviteCode: (value) => {
    if (typeof value === "string" && value.trim() !== "") {
      const trimmed = value.trim();
      set({ inviteCode: trimmed });
      localStorage.setItem("pendingInviteCode", trimmed);
    }
  },

  // 📈 Расчёт инкремента
  getMbIncrement: () => {
    const level = useLvlStore.getState().level || 1;
    const baseIncrement = 10;
    const levelBonus = Math.min(level - 1, 5); // Макс +5
    return baseIncrement + levelBonus;
  },

  // 🔁 Инкремент
  increment: async () => {
    const { getMbIncrement, mbCountAll, mbCount, progressTokens } = get();
    const increment = getMbIncrement();

    set({
      mbCountAll: mbCountAll + increment,
      mbCount: mbCount + increment,
      progressTokens: progressTokens + increment,
    });
  },

  // Установка общего количества
  setMbCountAll: (valueOrUpdater) => {
    set((state) => {
      const newValue =
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(state.mbCountAll)
          : valueOrUpdater;

      if (typeof newValue === "number" && newValue >= 0) {
        return { mbCountAll: newValue };
      }

      // ничего не обновляем, если некорректное значение
      return {};
    });
  },

  // Сброс сессионных данных
  resetCount: () => set({ mbCount: 0, progressTokens: 0 }),

  // 📤 Загрузка с сервера (только один раз)
  loadMbFromPlayer: async () => {
    if (get().loaded || get().isProcessing) return;

    set({ isProcessing: true });
    try {
      const user = getTelegramUser();
      if (!user) return;

      console.log('loadMbfromPlayer')
      const player = await fetchPlayerByTelegramId(user.id);
      if (player) {
        set({
          mbCountAll: Number(player.clicks) || 0,
          progressTokens: Number(player.progress_tokens) || 0,
          loaded: true,
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки данных игрока:", error);
    } finally {
      set({ isProcessing: false });
    }
  },

  // 💾 Автосохранение
 // ⬅️ добавить

  saveTokensToStrapi: async () => {
    if (get().isProcessing) return;

    set({ isProcessing: true });

    try {
      const { player } = usePlayerStore.getState(); // ⬅️ получаем из store
      if (!player?.documentId) {
        console.warn("❌ Нет documentId — не сохраняем");
        return;
      }

      const { mbCountAll, progressTokens } = get();
      console.log("💾 saveTokensToStrapi:", mbCountAll, progressTokens);

      await updatePlayer(player.documentId, {
        clicks: mbCountAll,
        progress_tokens: progressTokens,
      });
    } catch (error) {
      console.error("❌ Ошибка сохранения в Strapi:", error);
    } finally {
      set({ isProcessing: false });
    }
  },

  }));

export default useMbStore;
