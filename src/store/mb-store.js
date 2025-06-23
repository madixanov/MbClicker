import { create } from "zustand";
import { persist } from "zustand/middleware";
import getTelegramUser from "../utils/getTelegramUser";
import { fetchPlayerByTelegramId } from "../services/playerService";

const useMbStore = create(
  persist(
    (set, get) => ({
      mbCount: 0,
      mbCountAll: 0,
      mbInc: 1,

      // Загрузка кликов с сервера
      loadClicksFromStrapi: async () => {
        const user = getTelegramUser();
        if (!user) return;

        try {
          const player = await fetchPlayerByTelegramId(user.id);
          if (player && player.clicks !== undefined) {
            set({ mbCount: player.clicks, mbCountAll: player.clicks });
            console.log("✅ Клики загружены из Strapi:", player.clicks);
          }
        } catch (err) {
          console.error("❌ Ошибка при загрузке кликов:", err);
        }
      },

      incrementMb: () => {
        const { mbCount, mbCountAll, mbInc } = get();
        set({ mbCount: mbCount + mbInc, mbCountAll: mbCountAll + mbInc });
      },

      resetCount: () => set({ mbCount: 0 }),

      incrementMbInc: () => {
        const { mbInc } = get();
        set({ mbInc: mbInc + 1 });
      },
    }),
    {
      name: "mb-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useMbStore;
