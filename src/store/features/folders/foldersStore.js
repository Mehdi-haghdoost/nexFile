import { create } from "zustand";
import { api } from "@/lib/fetchWithAuth";

// Kept outside zustand state: mutating these must not trigger re-renders.
const inFlightRequests = new Map();
const cacheTimestamps = new Map();

// Short window that collapses the burst of duplicate mounts on page load.
const CACHE_TTL = 10 * 1000;

const getCacheKey = (parentFolder) => parentFolder || "root";

const invalidateCache = () => {
  cacheTimestamps.clear();
};

const useFoldersStore = create((set, get) => ({
  folders: [],
  selectedFolder: null,
  selectedFile: null,
  expandedFolders: [],
  selectedFiles: [],
  isLoading: false,
  error: null,

  setFolders: (folders) => set({ folders }),

  addFolder: (folder) => {
    invalidateCache();
    set((state) => ({ folders: [folder, ...state.folders] }));
  },

  updateFolder: (folderId, updates) => {
    invalidateCache();
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === folderId ? { ...folder, ...updates } : folder
      ),
    }));
  },

  removeFolder: (folderId) => {
    invalidateCache();
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== folderId),
    }));
  },

  setSelectedFolder: (folderId) => set({ selectedFolder: folderId }),

  setSelectedFile: (fileId) => set({ selectedFile: fileId }),

  toggleFolder: (folderId) =>
    set((state) => {
      if (state.expandedFolders.includes(folderId)) {
        return { expandedFolders: [] };
      }
      return { expandedFolders: [folderId] };
    }),

  toggleFileSelection: (fileId) =>
    set((state) => ({
      selectedFiles: state.selectedFiles.includes(fileId)
        ? state.selectedFiles.filter((id) => id !== fileId)
        : [...state.selectedFiles, fileId],
    })),

  selectAllFiles: () => {
    const state = get();
    const currentFolder = state.folders.find(
      (f) => f.id === state.selectedFolder
    );
    if (!currentFolder) return;

    const allFileIds = currentFolder.files?.map((f) => f.id) || [];
    set({
      selectedFiles:
        state.selectedFiles.length === allFileIds.length ? [] : allFileIds,
    });
  },

  clearFileSelection: () => set({ selectedFiles: [] }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  getSelectedFolderData: () => {
    const state = get();
    return state.folders.find((f) => f.id === state.selectedFolder);
  },

  getCurrentFolderFiles: () => {
    const state = get();
    const folder = state.folders.find((f) => f.id === state.selectedFolder);
    return folder?.files || [];
  },

  /** Force the next fetch to hit the network. */
  invalidateFolders: () => invalidateCache(),

  /**
   * Fetch folders with request deduplication.
   * Several components mounting at once share one network call instead of
   * each firing its own.
   *
   * @returns {Promise<{ success: boolean, data?: array, error?: string }>}
   */
  fetchFolders: async (parentFolder = null, options = {}) => {
    const { force = false } = options;
    const key = getCacheKey(parentFolder);

    if (!force) {
      // Join an identical request that is already running.
      if (inFlightRequests.has(key)) {
        return inFlightRequests.get(key);
      }

      const cachedAt = cacheTimestamps.get(key);
      if (cachedAt && Date.now() - cachedAt < CACHE_TTL) {
        return { success: true, data: get().folders };
      }
    }

    set({ isLoading: true, error: null });

    const request = (async () => {
      try {
        const params = new URLSearchParams();
        if (parentFolder) {
          params.append("parentFolder", parentFolder);
        }

        const query = params.toString();
        const response = await api.get(
          query ? `/api/folders?${query}` : "/api/folders"
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch folders");
        }

        const data = await response.json();
        const folders = data.folders || [];

        set({ folders, isLoading: false, error: null });
        cacheTimestamps.set(key, Date.now());

        return { success: true, data: folders };
      } catch (error) {
        set({ error: error.message, isLoading: false });
        cacheTimestamps.delete(key);
        return { success: false, error: error.message };
      } finally {
        inFlightRequests.delete(key);
      }
    })();

    inFlightRequests.set(key, request);
    return request;
  },
}));

export default useFoldersStore;