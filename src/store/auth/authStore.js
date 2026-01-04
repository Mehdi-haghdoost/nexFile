// import { create } from "zustand";

// const useAuthStore = create((set) => ({
//   // State
//   user: null,
//   isAuthenticated: false,
//   isLoading: false,
//   error: null,

//   // Actions
//   setUser: (user) => set({ user, isAuthenticated: !!user }),
  
//   setLoading: (isLoading) => set({ isLoading }),
  
//   setError: (error) => set({ error }),
  
//   clearError: () => set({ error: null }),

//   login: (user) => set({ 
//     user, 
//     isAuthenticated: true, 
//     error: null 
//   }),

//   logout: () => set({ 
//     user: null, 
//     isAuthenticated: false, 
//     error: null 
//   }),

//   clearAuth: () => set({
//     user: null,
//     isAuthenticated: false,
//     isLoading: false,
//     error: null,
//   }),
// }));

// export default useAuthStore;

import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => {
    console.log("📝 [authStore] setUser called with:", user?.email || 'null');
    set({ user, isAuthenticated: !!user });
  },
  
  setLoading: (isLoading) => {
    console.log("⏳ [authStore] setLoading:", isLoading);
    set({ isLoading });
  },
  
  setError: (error) => {
    console.log("❌ [authStore] setError:", error);
    set({ error });
  },
  
  clearError: () => {
    console.log("🧹 [authStore] clearError");
    set({ error: null });
  },

  login: (user) => {
    console.log("🔐 [authStore] login called with:", user?.email || 'null');
    set({ 
      user, 
      isAuthenticated: true, 
      error: null 
    });
  },

  logout: () => {
    console.log("🚪 [authStore] logout called");
    set({ 
      user: null, 
      isAuthenticated: false, 
      error: null 
    });
  },

  clearAuth: () => {
    console.log("🧹 [authStore] clearAuth called");
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },
}));

export default useAuthStore;