import { create } from 'zustand';

const useSortStore = create((set) => ({
    sortBy: 'name', // 'name', 'date', 'size', 'type'
    sortOrder: 'asc', // 'asc', 'desc'

    setSortBy: (sortBy) => set({ sortBy }),
    setSortOrder: (sortOrder) => set({ sortOrder }),
    
    toggleSortOrder: () => set((state) => ({
        sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc'
    })),

    setSort: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
}));

export default useSortStore;