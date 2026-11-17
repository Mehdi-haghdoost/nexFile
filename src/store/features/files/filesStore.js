import { create } from 'zustand';
import { api } from '@/lib/fetchWithAuth';
import useSortStore from '@/store/ui/sortStore';
import useFilterStore from '@/store/ui/filterStore';
import useSearchStore from '@/store/ui/searchStore';

// Files per page of the file list; Load more fetches the next page
const FILES_PAGE_SIZE = 30;

// The sort, filters and search the file list currently shows, for callers that only name a folder
const readListOptions = () => {
  const { sortBy, sortOrder } = useSortStore.getState();
  const { showRecent, showStarred } = useFilterStore.getState();
  const { searchQuery } = useSearchStore.getState();

  return { sortBy, sortOrder, showRecent, showStarred, search: searchQuery };
};

// Query for the first page of a folder's files, or of every file when no folder is given
const buildListParams = (folderId, options) => {
  const params = new URLSearchParams({
    limit: String(FILES_PAGE_SIZE),
    sort: options.sortBy || 'name',
    order: options.sortOrder === 'desc' ? 'desc' : 'asc',
  });

  if (folderId) params.set('folder', folderId);
  if (options.showRecent) params.set('recent', '1');
  if (options.showStarred) params.set('starred', '1');

  const search = (options.search || '').trim();
  if (search) params.set('search', search);

  return params;
};

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

// Newest fetchFiles request number, so an older response cannot overwrite a newer list
let latestFilesRequestId = 0;

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

  // Paging of the file list: where the next page starts, how many files match in all, and the query that loaded it
  filesNextCursor: null,
  filesTotal: 0,
  filesListParams: null,
  isLoadingMoreFiles: false,
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

  // A new file goes on top and counts toward the total until the next reload
  addFile: (file) => set((state) => ({
    allFiles: [file, ...state.allFiles],
    filesTotal: state.filesTotal + 1,
  })),

  updateFile: (fileId, updates) => set((state) => ({
    allFiles: state.allFiles.map((f) =>
      f.id === fileId ? { ...f, ...updates } : f
    )
  })),

  // The total drops only when the file was actually listed
  removeFile: (fileId) => set((state) => {
    const wasListed = state.allFiles.some((f) => f.id === fileId);

    return {
      allFiles: state.allFiles.filter((f) => f.id !== fileId),
      filesTotal: wasListed ? Math.max(0, state.filesTotal - 1) : state.filesTotal,
    };
  }),

  // Loads the first page of one folder's files, or of every file when no folder is given, sorted and filtered on the server
  fetchFiles: async (folderId = null, options = null) => {
    const requestId = ++latestFilesRequestId;
    const isLatest = () => requestId === latestFilesRequestId;
    const params = buildListParams(folderId, options || readListOptions());

    // A page still loading belongs to the old list, so its result is dropped once this request starts
    set({ isLoading: true, error: null, isLoadingMoreFiles: false });

    try {
      // Refreshes and retries on a 401, which a cold page load with an expired token hits
      const response = await api.get(`/api/files?${params.toString()}`);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to fetch files');
      }

      const data = await response.json();

      if (!data.success || !data.files) {
        throw new Error('Invalid response format');
      }

      // A newer request owns the list now, so this older result is dropped
      if (!isLatest()) return { success: true, stale: true, data: get().allFiles };

      set({
        allFiles: data.files,
        isLoading: false,
        filesNextCursor: typeof data.nextCursor === 'string' ? data.nextCursor : null,
        filesTotal: Number.isFinite(data.total) ? data.total : data.files.length,
        filesListParams: params.toString(),
      });
      return { success: true, data: data.files };
    } catch (error) {
      // An older request failing must not clear the list or end the newer one's loading state
      if (!isLatest()) return { success: true, stale: true, data: get().allFiles };

      set({ error: error.message, isLoading: false, allFiles: [], filesNextCursor: null, filesTotal: 0 });
      return { success: false, error: error.message };
    }
  },

  // Adds the next page under the files already listed; waits while the list itself is reloading
  loadMoreFiles: async () => {
    const { filesNextCursor, filesListParams, isLoading, isLoadingMoreFiles } = get();
    if (!filesNextCursor || !filesListParams || isLoading || isLoadingMoreFiles) {
      return { success: false, skipped: true };
    }

    const requestId = latestFilesRequestId;
    const isCurrent = () => requestId === latestFilesRequestId;

    set({ isLoadingMoreFiles: true });

    try {
      const params = new URLSearchParams(filesListParams);
      params.set('cursor', filesNextCursor);

      const response = await api.get(`/api/files?${params.toString()}`);
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success || !Array.isArray(data.files)) {
        throw new Error(data?.message || 'Failed to load more files');
      }

      // A reload since then has replaced the list this page continues
      if (!isCurrent()) return { success: true, stale: true };

      set((state) => {
        // Skips any file already listed, so none can appear twice
        const listed = new Set(state.allFiles.map((f) => f.id));

        return {
          allFiles: [...state.allFiles, ...data.files.filter((f) => !listed.has(f.id))],
          filesNextCursor: typeof data.nextCursor === 'string' ? data.nextCursor : null,
          isLoadingMoreFiles: false,
        };
      });
      return { success: true };
    } catch (error) {
      if (!isCurrent()) return { success: true, stale: true };

      set({ isLoadingMoreFiles: false });
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