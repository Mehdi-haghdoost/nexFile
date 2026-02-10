import { create } from 'zustand';

const useViewModeStore = create((set) => ({
    viewMode: typeof window !== 'undefined' 
        ? (localStorage.getItem('viewMode') || 'list') 
        : 'list',

    setViewMode: (mode) => {
        set({ viewMode: mode });
        if (typeof window !== 'undefined') {
            localStorage.setItem('viewMode', mode);
        }
    },

    toggleViewMode: () => set((state) => {
        const newMode = state.viewMode === 'list' ? 'grid' : 'list';
        if (typeof window !== 'undefined') {
            localStorage.setItem('viewMode', newMode);
        }
        return { viewMode: newMode };
    }),
}));

export default useViewModeStore;