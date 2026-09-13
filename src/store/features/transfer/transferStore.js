import { create } from 'zustand';

const useTransferStore = create((set) => ({
  // Draft state for the create modal
  files: [],
  transferType: 'link', // 'link' or 'email'
  expirationDate: null,
  hasPassword: false,

  // Bumped after a transfer is created so the list refetches from the server
  transfersVersion: 0,

  // Actions
  addFiles: (newFiles) => set((state) => ({
    files: [...state.files, ...newFiles]
  })),

  removeFile: (fileId) => set((state) => ({
    files: state.files.filter(file => file.id !== fileId)
  })),

  setTransferType: (type) => set({ transferType: type }),

  setExpirationDate: (date) => set({ expirationDate: date }),

  setHasPassword: (hasPassword) => set({ hasPassword }),

  clearTransfer: () => set({
    files: [],
    transferType: 'link',
    expirationDate: null,
    hasPassword: false,
  }),

  refreshTransfers: () => set((state) => ({
    transfersVersion: state.transfersVersion + 1
  })),
}));

export default useTransferStore;