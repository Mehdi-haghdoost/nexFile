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

  // Get selected folder data with files
  getSelectedFolderData: () => {
    const state = get();
    return state.folders.find((f) => f.id === state.selectedFolder);
  },

  // Get current folder files (empty array for now, will be populated from File API later)
  getCurrentFolderFiles: () => {
    const state = get();
    const folder = state.folders.find((f) => f.id === state.selectedFolder);
    return folder?.files || [];
  },
}));

export default useFoldersStore;