import { create } from 'zustand';

const usePlacementStore = create((set) => ({
  placement: 0,
  setPlacement: (myPlacement) => set({ placement: myPlacement })
}));

export default usePlacementStore;
