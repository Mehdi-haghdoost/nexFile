import { create } from "zustand";
import { api } from "@/lib/fetchWithAuth";

// Kept outside the store so mutating it never triggers a re-render.
let inFlightRequest = null;

const useSettingsStore = create((set, get) => ({
  settings: null,
  isAdmin: false,
  isLoading: false,
  error: null,

  setSettings: (settings) => set({ settings }),

  /** Concurrent callers share one request instead of each hitting the API. */
  fetchSettings: async (options = {}) => {
    const { force = false } = options;

    if (!force && inFlightRequest) {
      return inFlightRequest;
    }

    set({ isLoading: true, error: null });

    inFlightRequest = (async () => {
      try {
        const res = await api.get("/api/admin/settings");
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load settings");
        }

        set({
          settings: data.settings,
          isAdmin: Boolean(data.isAdmin),
          isLoading: false,
          error: null,
        });

        return { success: true, data: data.settings };
      } catch (error) {
        set({ error: error.message, isLoading: false });
        return { success: false, error: error.message };
      } finally {
        inFlightRequest = null;
      }
    })();

    return inFlightRequest;
  },

  /**
   * Applies the change locally first, then persists it. On failure the
   * previous value is restored rather than left out of sync with the server.
   */
  updateSettings: async (updates) => {
    const previous = get().settings;

    set({
      settings: {
        ...previous,
        ...updates,
        features: { ...previous?.features, ...updates.features },
      },
    });

    try {
      const res = await api.patch("/api/admin/settings", updates);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update settings");
      }

      set({ settings: data.settings });
      return { success: true };
    } catch (error) {
      set({ settings: previous });
      return { success: false, message: error.message };
    }
  },
}));

export default useSettingsStore;