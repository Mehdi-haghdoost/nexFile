import { create } from 'zustand';

const useFilesStore = create((set, get) => ({
  allFiles: [],
  deletedFiles: [],
  sharedFiles: [],
  recentFiles: [],
  uploadingFiles: [],

  selectedFiles: [],

  isLoading: false,
  isDeletedLoading: false,
  error: null,
  viewMode: 'grid',
  sortBy: 'name',

  addUploadingFile: (file) => set((state) => ({
    uploadingFiles: [...state.uploadingFiles, file]
  })),

  updateUploadingFile: (fileId, updates) => set((state) => ({
    uploadingFiles: state.uploadingFiles.map((f) =>
      f.id === fileId ? { ...f, ...updates } : f
    )
  })),

  removeUploadingFile: (fileId) => set((state) => ({
    uploadingFiles: state.uploadingFiles.filter((f) => f.id !== fileId)
  })),

  clearUploadingFiles: () => set({ uploadingFiles: [] }),

  setFiles: (files) => set({ allFiles: files }),

  addFile: (file) => set((state) => ({
    allFiles: [file, ...state.allFiles]
  })),

  updateFile: (fileId, updates) => set((state) => ({
    allFiles: state.allFiles.map((f) =>
      f.id === fileId ? { ...f, ...updates } : f
    )
  })),

  removeFile: (fileId) => set((state) => ({
    allFiles: state.allFiles.filter((f) => f.id !== fileId)
  })),

  fetchFiles: async (folderId = null) => {
    set({ isLoading: true, error: null });

    try {
      const params = new URLSearchParams();
      if (folderId) {
        params.append('folder', folderId);
      }

      const response = await fetch(`/api/files?${params.toString()}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch files');
      }

      const data = await response.json();

      if (data.success && data.files) {
        set({ allFiles: data.files, isLoading: false });
        return { success: true, data: data.files };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Load soft-deleted files and folders for the trash view
  fetchDeletedFiles: async () => {
    set({ isDeletedLoading: true, error: null });

    try {
      const response = await fetch('/api/files/deleted', {
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch deleted files');
      }

      const data = await response.json();

      if (data.success) {
        set({ deletedFiles: data.items || [], isDeletedLoading: false });
        return { success: true, data: data.items };
      }
      throw new Error('Invalid response format');
    } catch (error) {
      set({ error: error.message, isDeletedLoading: false, deletedFiles: [] });
      return { success: false, error: error.message };
    }
  },

  // Restore all currently selected items, then drop them from the trash list
  restoreFiles: async () => {
    const { selectedFiles, deletedFiles } = get();
    if (selectedFiles.length === 0) return { success: false };

    const targets = deletedFiles.filter((f) => selectedFiles.includes(f.id));

    try {
      await Promise.all(
        targets.map((item) =>
          fetch(`/api/files/${item.id}/restore`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemType: item.itemType }),
          })
        )
      );

      set((state) => ({
        deletedFiles: state.deletedFiles.filter(
          (f) => !selectedFiles.includes(f.id)
        ),
        selectedFiles: [],
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Permanently delete the given items, then drop them from the trash list
  permanentDeleteFiles: async (ids = []) => {
    const { deletedFiles } = get();
    const targets = deletedFiles.filter((f) => ids.includes(f.id));
    if (targets.length === 0) return { success: false };

    try {
      await Promise.all(
        targets.map((item) =>
          fetch(`/api/files/${item.id}/permanent`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemType: item.itemType }),
          })
        )
      );

      set((state) => ({
        deletedFiles: state.deletedFiles.filter((f) => !ids.includes(f.id)),
        selectedFiles: state.selectedFiles.filter((id) => !ids.includes(id)),
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  selectFile: (fileId) => set((state) => ({
    selectedFiles: state.selectedFiles.includes(fileId)
      ? state.selectedFiles.filter(id => id !== fileId)
      : [...state.selectedFiles, fileId]
  })),

  clearSelection: () => set({ selectedFiles: [] }),

  selectAll: (fileType = 'all') => set((state) => {
    const files = fileType === 'deleted' ? state.deletedFiles : state.allFiles;
    return { selectedFiles: files.map(f => f.id) };
  }),

  setViewMode: (mode) => set({ viewMode: mode }),
  setSortBy: (sortBy) => set({ sortBy }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}));

export default useFilesStore;