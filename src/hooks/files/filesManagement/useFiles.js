import { useCallback, useEffect, useRef, useState } from 'react';
import useFilesStore from '@/store/features/files/filesStore';
import { showErrorToast } from '@/lib/toast';
import useSortStore from '@/store/ui/sortStore';
import useFilterStore from '@/store/ui/filterStore';
import useSearchStore from '@/store/ui/searchStore';
import { sortItems } from '@/utils/helpers/sortHelpers';
import { filterFiles } from '@/utils/helpers/filterHelpers';
import { searchFiles } from '@/utils/helpers/searchHelpers';

// Wait after the last keystroke before searching on the server
const SEARCH_DEBOUNCE_MS = 300;

const LOAD_MORE_FAILED_MESSAGE = "Couldn't load more files. Please try again.";

export const useFiles = (folderId = null) => {
  const {
    allFiles,
    error,
    fetchFiles,
    loadMoreFiles,
    filesTotal,
    filesNextCursor,
    isLoadingMoreFiles,
  } = useFilesStore();

  const { sortBy, sortOrder } = useSortStore();
  const { showRecent, showStarred } = useFilterStore();
  const { searchQuery } = useSearchStore();

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // The folder the list was last loaded for, so only a different folder shows the full loading state
  const loadedFolder = useRef(undefined);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sorting, filtering and searching happen on the server, so every file counts, not only the loaded pages
  useEffect(() => {
    let cancelled = false;

    // A new sort, filter or search keeps the current files on screen until the new ones arrive
    const isNewFolder = loadedFolder.current !== folderId;
    loadedFolder.current = folderId;

    const loadFiles = async () => {
      if (isNewFolder) setIsInitialLoading(true);

      const result = await fetchFiles(folderId, {
        sortBy,
        sortOrder,
        showRecent,
        showStarred,
        search: debouncedSearch,
      });

      if (cancelled) return;

      if (!result.success) showErrorToast(result.error);

      setIsInitialLoading(false);
    };

    loadFiles();

    return () => { cancelled = true; };
  }, [folderId, fetchFiles, sortBy, sortOrder, showRecent, showStarred, debouncedSearch]);

  // Toasts a failed page; a dead session is already on its way to the login page
  const loadMore = useCallback(async () => {
    const result = await loadMoreFiles();
    if (result.success || result.skipped) return;
    if (result.error !== 'Session expired') showErrorToast(LOAD_MORE_FAILED_MESSAGE);
  }, [loadMoreFiles]);

  // The name each file is shown, searched and sorted by
  const namedFiles = allFiles.map((file) => ({
    ...file,
    displayName: file.originalName || file.name,
  }));

  // The same rules run again on the loaded files, so a star, rename or new upload shows at once
  const filteredFiles = filterFiles(namedFiles, { showRecent, showStarred });
  const searchedFiles = searchFiles(filteredFiles, searchQuery);
  const sortedFiles = sortItems(searchedFiles, sortBy, sortOrder);

  return {
    files: sortedFiles,
    isLoading: isInitialLoading,
    error,
    refetch: () => fetchFiles(folderId),
    totalFiles: filesTotal,
    hasMore: Boolean(filesNextCursor),
    isLoadingMore: isLoadingMoreFiles,
    loadMore,
    filteredCount: searchedFiles.length,
    activeFilters: { showRecent, showStarred },
    searchQuery,
  };
};