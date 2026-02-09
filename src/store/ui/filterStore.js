import { create } from 'zustand';

const useFilterStore = create((set) => ({
    showRecent: false,
    showStarred: false,

    toggleRecent: () => set((state) => ({ showRecent: !state.showRecent })),
    toggleStarred: () => set((state) => ({ showStarred: !state.showStarred })),
    
    clearFilters: () => set({ showRecent: false, showStarred: false }),
}));

export default useFilterStore;