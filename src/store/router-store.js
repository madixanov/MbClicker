import { create } from "zustand";

const useRouterStore = create((set) => ({
    selectedRoute: "HOME",
    setSelectedRoute: (route) => set({ selectedRoute: route })
}));

export default useRouterStore;