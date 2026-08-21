import { create } from "zustand";
import { api } from "@/lib/fetchWithAuth";

// Kept outside the store so mutating it never triggers a re-render.
let inFlightRequest = null;

const useBillingStore = create((set, get) => ({
  billing: null,
  isAdmin: false,
  isLoading: false,
  error: null,
  activeTab: "manage-plan",

  setActiveTab: (activeTab) => set({ activeTab }),

  setBilling: (billing) => set({ billing }),

  setError: (error) => set({ error }),

  clearBilling: () =>
    set({ billing: null, isAdmin: false, isLoading: false, error: null }),

  /**
   * Load plan, usage and summary for the current organization.
   * Concurrent callers share one request instead of each hitting the API.
   *
   * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
   */
  fetchBilling: async (options = {}) => {
    const { force = false } = options;

    if (!force && inFlightRequest) {
      return inFlightRequest;
    }

    set({ isLoading: true, error: null });

    inFlightRequest = (async () => {
      try {
        const res = await api.get("/api/admin/billing");
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load billing");
        }

        set({
          billing: data.billing,
          isAdmin: Boolean(data.isAdmin),
          isLoading: false,
          error: null,
        });

        return { success: true, data: data.billing };
      } catch (error) {
        set({ error: error.message, isLoading: false });
        return { success: false, error: error.message };
      } finally {
        inFlightRequest = null;
      }
    })();

    return inFlightRequest;
  },

  /** Percentage of the plan's seat allowance in use. */
  getSeatPercentage: () => {
    const usage = get().billing?.usage;
    if (!usage?.seatLimit) return 0;
    return Math.min((usage.seatsUsed / usage.seatLimit) * 100, 100);
  },

  /** Percentage of the plan's storage quota in use. */
  getStoragePercentage: () => {
    const usage = get().billing?.usage;
    if (!usage?.storageQuotaBytes) return 0;
    return Math.min((usage.storageUsedBytes / usage.storageQuotaBytes) * 100, 100);
  },
}));

export default useBillingStore;