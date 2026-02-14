import { create } from "zustand";

const useSignaturesStore = create((set) => ({
  signatures: [],
  isLoading: false,
  error: null,
  
  setSignatures: (signatures) => set({ signatures }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  addSignature: (signature) => set((state) => ({
    signatures: [signature, ...state.signatures],
  })),
  
  removeSignature: (signatureId) => set((state) => ({
    signatures: state.signatures.filter(sig => sig._id !== signatureId),
  })),
  
  updateSignature: (signatureId, updates) => set((state) => ({
    signatures: state.signatures.map(sig =>
      sig._id === signatureId ? { ...sig, ...updates } : sig
    ),
  })),
  
  setDefaultSignature: (signatureId) => set((state) => ({
    signatures: state.signatures.map(sig => ({
      ...sig,
      isDefault: sig._id === signatureId,
    })),
  })),
  
  clearSignatures: () => set({ signatures: [], error: null }),
}));

export default useSignaturesStore;