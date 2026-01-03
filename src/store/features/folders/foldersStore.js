import { create } from "zustand";

const useFoldersStore = create((set, get) => ({
  folders: [],
  selectedFolder: null,
  selectedFile: null,
  expandedFolders: [],
  selectedFiles: [],
  isLoading: false,
  error: null,

  setFolders: (folders) => set({ folders }),

  addFolder: (folder) =>
    set((state) => ({
      folders: [folder, ...state.folders],
    })),

  updateFolder: (folderId, updates) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === folderId ? { ...folder, ...updates } : folder
      ),
    })),

  removeFolder: (folderId) =>
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== folderId),
    })),

  setSelectedFolder: (folderId) => set({ selectedFolder: folderId }),

  setSelectedFile: (fileId) => set({ selectedFile: fileId }),

  toggleFolder: (folderId) =>
    set((state) => {
      if (state.expandedFolders.includes(folderId)) {
        return {
          expandedFolders: [],
        };
      }
      return {
        expandedFolders: [folderId],
      };
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

  // Fetch folders from API
  fetchFolders: async (parentFolder = null) => {
    set({ isLoading: true, error: null });
    
    try {
      const params = new URLSearchParams();
      if (parentFolder) {
        params.append('parentFolder', parentFolder);
      }

      const response = await fetch(`/api/folders?${params.toString()}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch folders');
      }

      const data = await response.json();
      
      if (data.success && data.folders) {
        set({ folders: data.folders, isLoading: false });
        return { success: true, data: data.folders };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },
}));

export default useFoldersStore;