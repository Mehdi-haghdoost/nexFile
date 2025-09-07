import { create } from "zustand";

const usePdfEditorStore = create((set, get) => ({
    // PDF Editor State
    activeEditingTool: null,
    currentPage: 1,
    totalPages: 2,
    zoomLevel: 100,
    selectedPage: 1,

    // Actions
    setActiveEditingTool: (tool) => {
        console.log('Store - setActiveEditingTool called with:', tool);
        set((state) => {
            const newTool = state.activeEditingTool === tool ? null : tool;
            console.log('Store - changing from:', state.activeEditingTool, 'to:', newTool);
            return { activeEditingTool: newTool };
        });
        
        // Log after setting
        const currentState = get();
        console.log('Store - new state:', currentState.activeEditingTool);
    },

    setCurrentPage: (page) => {
        set((state) => ({
            currentPage: Math.max(1, Math.min(page, state.totalPages))
        }))
    },

    setZoomLevel: (level) => {
        set((state) => ({
            zoomLevel: Math.max(25, Math.min(level, 200))
        }))
    },

    zoomIn: () => {
        set((state) => ({
            zoomLevel: Math.min(state.zoomLevel + 25, 200)
        }))
    },

    zoomOut: () => {
        set((state) => ({
            zoomLevel: Math.max(state.zoomLevel - 25, 25)
        }))
    },

    setSelectedPage: (page) => {
        set({ selectedPage: page })
    },

    setTotalPages: (total) => {
        set({ totalPages: total })
    },

    resetPdfEditor: () => {
        set({
            activeEditingTool: null,
            currentPage: 1,
            totalPages: 2,
            zoomLevel: 100,
            selectedPage: 1,
        })
    },

    // Helper functions
    isToolActive: (tool) => {
        const state = get();
        return state.activeEditingTool === tool;
    },

    hasActiveToolbar: () => {
        const state = get();
        return state.activeEditingTool !== null;
    }
}));

export default usePdfEditorStore;