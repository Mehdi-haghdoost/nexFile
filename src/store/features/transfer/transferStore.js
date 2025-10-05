import { create } from 'zustand';

const useTransferStore = create((set) => ({
  // State
  files: [],
  transferType: 'link', // 'link' or 'email'
  expirationDate: null,
  hasPassword: false,
  transfers: [], // لیست transferهای ارسال شده

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

  // ذخیره transfer جدید
  addTransfer: (transfer) => set((state) => ({
    transfers: [transfer, ...state.transfers]
  })),

  // حذف transfer
  removeTransfer: (transferId) => set((state) => ({
    transfers: state.transfers.filter(t => t.id !== transferId)
  })),
}));

export default useTransferStore;