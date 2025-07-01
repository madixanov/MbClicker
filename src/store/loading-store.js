// store/loading-store.js
import { create } from "zustand";

const useLoadingStore = create((set) => ({
  progress: 0,
  setProgress: (value) => set({ progress: value }),
}));

export default useLoadingStore;
