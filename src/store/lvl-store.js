import { create } from "zustand";
import { persist } from "zustand/middleware"

const useLvlStore = create(
    persist(
        (set) => ({
            level: 1,
            points: 1024,
            upgradeLevel: () => set((state) => ({
                level: state.level + 1
            })),
            upgradePoints: () => set((state) => ({
                points: state.points * 2
            }))
        }),
        {
            name: "lvl-storage",
            getStorage: () => localStorage,
        }
    )
);

export default useLvlStore;