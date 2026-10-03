import { create } from "zustand";
import { api } from "@/lib/fetchWithAuth";

// Kept outside zustand state: mutating these must not trigger re-renders.
const inFlightRequests = new Map();
const cacheTimestamps = new Map();

// Short window that collapses the burst of duplicate mounts on page load.
const CACHE_TTL = 10 * 1000;

// Root folders have no parent id, so they need a key of their own
export const ROOT_KEY = "root";

export const getFolderCacheKey = (parentFolder) => parentFolder || ROOT_KEY;

const useFoldersStore = create((set, get) => ({
  // One list per parent, so loading a folder's children cannot overwrite the level above it
  foldersByParent: {},
  loadingParents: {},
  expandedFolders: [],
  error: null,

  getFolders: (parentFolder = null) =>
    get().foldersByParent[getFolderCacheKey(parentFolder)] || [],

  isParentLoading: (parentFolder = null) =>
    Boolean(get().loadingParents[getFolderCacheKey(parentFolder)]),

  setFolders: (parentFolder, folders) =>
    set((state) => ({
      foldersByParent: {
        ...state.foldersByParent,
        [getFolderCacheKey(parentFolder)]: folders,
      },
    })),

  // The new folder carries its own parent, so it lands in the right level
  addFolder: (folder) => {
    const key = getFolderCacheKey(folder.parentFolder);
    const parentId = folder.parentFolder ? String(folder.parentFolder) : null;

    cacheTimestamps.delete(key);

    set((state) => {
      const next = {};

      // The parent gains a subfolder wherever it sits, so the tree shows its expand control at once
      for (const [levelKey, folders] of Object.entries(state.foldersByParent)) {
        next[levelKey] = parentId
          ? folders.map((item) =>
              item.id === parentId
                ? { ...item, subFoldersCount: (item.subFoldersCount || 0) + 1 }
                : item
            )
          : folders;
      }

      next[key] = [folder, ...(next[key] || [])];

      return { foldersByParent: next };
    });
  },

  // A folder's level is not known here, so every level is checked
  updateFolder: (folderId, updates) => {
    cacheTimestamps.clear();

    set((state) => {
      const next = {};

      for (const [key, folders] of Object.entries(state.foldersByParent)) {
        next[key] = folders.map((folder) =>
          folder.id === folderId ? { ...folder, ...updates } : folder
        );
      }

      return { foldersByParent: next };
    });
  },

  removeFolder: (folderId) => {
    cacheTimestamps.clear();

    set((state) => {
      const next = {};

      for (const [key, folders] of Object.entries(state.foldersByParent)) {
        next[key] = folders.filter((folder) => folder.id !== folderId);
      }

      // Its children go too, since they are unreachable once the parent is gone
      delete next[folderId];

      return {
        foldersByParent: next,
        expandedFolders: state.expandedFolders.filter((id) => id !== folderId),
      };
    });
  },

  // Several branches of the tree can be open at once
  toggleFolder: (folderId) =>
    set((state) => ({
      expandedFolders: state.expandedFolders.includes(folderId)
        ? state.expandedFolders.filter((id) => id !== folderId)
        : [...state.expandedFolders, folderId],
    })),

  // Opens every branch leading to a folder, so the tree reveals where the page is
  expandPath: (folderIds = []) =>
    set((state) => {
      const missing = folderIds.filter((id) => id && !state.expandedFolders.includes(id));
      if (!missing.length) return state;

      return { expandedFolders: [...state.expandedFolders, ...missing] };
    }),

  collapseAll: () => set({ expandedFolders: [] }),

  setError: (error) => set({ error }),

  // Forces the next fetch of one level, or of every level, to hit the network
  invalidateFolders: (parentFolder) => {
    if (parentFolder === undefined) {
      cacheTimestamps.clear();
      return;
    }
    cacheTimestamps.delete(getFolderCacheKey(parentFolder));
  },

  // Fetches one level, deduplicated so parallel mounts share a single request
  fetchFolders: async (parentFolder = null, options = {}) => {
    const { force = false } = options;
    const key = getFolderCacheKey(parentFolder);

    if (!force) {
      if (inFlightRequests.has(key)) {
        return inFlightRequests.get(key);
      }

      const cachedAt = cacheTimestamps.get(key);
      if (cachedAt && Date.now() - cachedAt < CACHE_TTL) {
        return { success: true, data: get().foldersByParent[key] || [] };
      }
    }

    set((state) => ({
      loadingParents: { ...state.loadingParents, [key]: true },
      error: null,
    }));

    const request = (async () => {
      try {
        const params = new URLSearchParams();
        if (parentFolder) params.append("parentFolder", parentFolder);

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

        set((state) => ({
          foldersByParent: { ...state.foldersByParent, [key]: folders },
          loadingParents: { ...state.loadingParents, [key]: false },
          error: null,
        }));

        cacheTimestamps.set(key, Date.now());

        return { success: true, data: folders };
      } catch (error) {
        set((state) => ({
          error: error.message,
          loadingParents: { ...state.loadingParents, [key]: false },
        }));

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