import { create } from 'zustand';

const useTransferStore = create((set) => ({
  // State
  files: [],
  transferType: 'link', // 'link' or 'email'
  expirationDate: null,
  hasPassword: false,
  transfers: [], // list of sent transfers

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

  // Store a newly created transfer
  addTransfer: (transfer) => set((state) => ({
    transfers: [transfer, ...state.transfers]
  })),

  // Remove a transfer from the list
  removeTransfer: (transferId) => set((state) => ({
    transfers: state.transfers.filter(t => t.id !== transferId)
  })),
}));

export default useTransferStore;