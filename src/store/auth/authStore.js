import { create } from "zustand";

const useAuthStore = create((set) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),

  login: (user) => set({ 
    user, 
    isAuthenticated: true, 
    error: null 
  }),

  logout: () => set({ 
    user: null, 
    isAuthenticated: false, 
    error: null 
  }),

  clearAuth: () => set({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }),
}));

export default useAuthStore;