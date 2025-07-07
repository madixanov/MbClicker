// store/player-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePlayerStore = create(
  persist(
    (set) => ({
      player: null,
      setPlayer: (data) => set({ player: data }),
    }),
    {
      name: "player-storage", // ключ для localStorage
    }
  )
);
    
export default usePlayerStore;
