import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useMbStore = create(
    persist(
        (set) => ({
        mbCountAll: 0,
        mbCount: 0,
        mbIncrement: 10,
        increment: () =>
            set((state) => ({
            mbCountAll: state.mbCountAll + state.mbIncrement, 
            mbCount: state.mbCount + state.mbIncrement,
            })),
        incrementMbInc: () =>
            set((state) => ({
            mbIncrement: state.mbIncrement + 1,
            })),
        resetCount: () =>
            set(() => ({
            mbCount: 0,
            })),
        }),
        {
        name: 'mbCounter-storage',
        getStorage: () => localStorage,
        }
    )
);

export default useMbStore;
