import { create } from 'zustand';
import { api } from '@/lib/fetchWithAuth';

// Each request is inspected, since a fetch promise rejects only on a network
// failure and an HTTP error would otherwise be counted as a success
const runBatch = async (items, request) => {
  const outcomes = await Promise.all(
    items.map(async (item) => {
      try {
        const response = await request(item);
        const data = await response.json().catch(() => ({}));

        return { item, ok: response.ok && data?.success !== false };
      } catch (error) {
        console.error(`Batch request failed for ${item.name}:`, error.message);
        return { item, ok: false };
      }
    })
  );

  return {
    succeeded: outcomes.filter((outcome) => outcome.ok).map((outcome) => outcome.item),
    failed: outcomes.filter((outcome) => !outcome.ok).map((outcome) => outcome.item),
  };
};

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

  // Lists one folder's files, or the root's when no folder is given
  fetchFiles: async (folderId = null) => {
    set({ isLoading: true, error: null });

    try {
      const params = new URLSearchParams();
      if (folderId) params.append('folder', folderId);

      const query = params.toString();

      // Refreshes and retries on a 401, which a cold page load with an expired token hits
      const response = await api.get(query ? `/api/files?${query}` : '/api/files');

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to fetch files');
      }

      const data = await response.json();

      if (!data.success || !data.files) {
        throw new Error('Invalid response format');
      }

      set({ allFiles: data.files, isLoading: false });
      return { success: true, data: data.files };
    } catch (error) {
      set({ error: error.message, isLoading: false, allFiles: [] });
      return { success: false, error: error.message };
    }
  },

  // Load soft-deleted files and folders for the trash view
  fetchDeletedFiles: async () => {
    set({ isDeletedLoading: true, error: null });

    try {
      const response = await api.get('/api/files/deleted');

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to fetch deleted files');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error('Invalid response format');
      }

      set({ deletedFiles: data.items || [], isDeletedLoading: false });
      return { success: true, data: data.items };
    } catch (error) {
      set({ error: error.message, isDeletedLoading: false, deletedFiles: [] });
      return { success: false, error: error.message };
    }
  },

  // Restores the selected items, dropping only the ones the server confirmed
  restoreFiles: async () => {
    const { selectedFiles, deletedFiles } = get();
    if (selectedFiles.length === 0) return { success: false };

    const targets = deletedFiles.filter((f) => selectedFiles.includes(f.id));

    const { succeeded, failed } = await runBatch(targets, (item) =>
      api.patch(`/api/files/${item.id}/restore`, { itemType: item.itemType })
    );

    const restoredIds = succeeded.map((item) => item.id);

    // A failed item stays in the trash, so the list keeps matching the server
    set((state) => ({
      deletedFiles: state.deletedFiles.filter((f) => !restoredIds.includes(f.id)),
      selectedFiles: state.selectedFiles.filter((id) => !restoredIds.includes(id)),
    }));

    return {
      success: failed.length === 0,
      restoredCount: succeeded.length,
      failedCount: failed.length,
      error: failed.length ? `Could not restore ${failed.length} of ${targets.length}` : null,
    };
  },

  // Permanently deletes the given items, dropping only the ones the server confirmed
  permanentDeleteFiles: async (ids = []) => {
    const { deletedFiles } = get();
    const targets = deletedFiles.filter((f) => ids.includes(f.id));
    if (targets.length === 0) return { success: false };

    // The body carries the item type, which api.delete passes through its options
    const { succeeded, failed } = await runBatch(targets, (item) =>
      api.delete(`/api/files/${item.id}/permanent`, {
        body: JSON.stringify({ itemType: item.itemType }),
      })
    );

    const deletedIds = succeeded.map((item) => item.id);

    set((state) => ({
      deletedFiles: state.deletedFiles.filter((f) => !deletedIds.includes(f.id)),
      selectedFiles: state.selectedFiles.filter((id) => !deletedIds.includes(id)),
    }));

    return {
      success: failed.length === 0,
      deletedCount: succeeded.length,
      failedCount: failed.length,
      error: failed.length ? `Could not delete ${failed.length} of ${targets.length}` : null,
    };
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