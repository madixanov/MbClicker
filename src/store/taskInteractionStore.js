// store/taskInteractionStore.js
import { create } from "zustand";

const useTaskInteractionStore = create((set) => ({
  isProcessing: false,
  setIsProcessing: (value) => set({ isProcessing: value }),
}));

export default useTaskInteractionStore;
