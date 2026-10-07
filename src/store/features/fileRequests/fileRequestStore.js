import { create } from 'zustand';

const useFileRequestStore = create((set) => ({
  // Bumped after a request is created, so the list refetches without a reload
  requestsVersion: 0,

  refreshRequests: () =>
    set((state) => ({ requestsVersion: state.requestsVersion + 1 })),
}));

export default useFileRequestStore;