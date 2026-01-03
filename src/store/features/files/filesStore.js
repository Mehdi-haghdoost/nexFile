import { create } from 'zustand';

const useFilesStore = create((set, get) => ({
  // Files State
  allFiles: [],
  deletedFiles: [],
  sharedFiles: [],
  recentFiles: [],
  uploadingFiles: [],
  
  // Selection State
  selectedFiles: [],
  
  // UI State
  isLoading: false,
  error: null,
  viewMode: 'grid',
  sortBy: 'name',
  
  // File Upload Actions
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

  // File Actions
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
  
  // ... rest of the store actions remain the same
  
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