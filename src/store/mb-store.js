import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useMbStore = create(
    persist(
        (set) => ({
            mbCount: 0,
            increment: () =>
                set((state) => ({
                    mbCount: state.mbCount + 1
                }))
        }),
        {
            name: "mbCounter-storage",
            getStorage: () => localStorage,
        }
    )
);

export default useMbStore;
