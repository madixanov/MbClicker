// store/modal-store.js
import { create } from "zustand";

const useModalStore = create((set) => ({
  isModalDayOpen: false,
  isModalThemeOpen: false,

  setModalDay: (isOpen) => set({ isModalDayOpen: isOpen }),
  setModalTheme: (isOpen) => set({ isModalThemeOpen: isOpen }),
}));

export default useModalStore;
