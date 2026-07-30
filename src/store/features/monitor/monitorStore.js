import { create } from 'zustand';

// Lightweight store used to signal the monitor table to refetch
// after a file is sent from the modal.
const useMonitorStore = create((set) => ({
  refreshKey: 0,
  bumpRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));

export default useMonitorStore;