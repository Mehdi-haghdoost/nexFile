import { useEffect, useState } from 'react';
import useFilesStore from '@/store/features/files/filesStore';
import { showErrorToast } from '@/lib/toast';
import useSortStore from '@/store/ui/sortStore';
import useFilterStore from '@/store/ui/filterStore';
import useSearchStore from '@/store/ui/searchStore';
import { sortItems } from '@/utils/helpers/sortHelpers';
import { filterFiles } from '@/utils/helpers/filterHelpers';
import { searchFiles } from '@/utils/helpers/searchHelpers';

export const useFiles = (folderId = null) => {
  const { allFiles, error, fetchFiles } = useFilesStore();

  const { sortBy, sortOrder } = useSortStore();
  const { showRecent, showStarred } = useFilterStore();
  const { searchQuery } = useSearchStore();

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadFiles = async () => {
      setIsInitialLoading(true);

      const result = await fetchFiles(folderId);

      if (cancelled) return;

      if (!result.success) showErrorToast(result.error);

      setIsInitialLoading(false);
    };

    loadFiles();

    return () => { cancelled = true; };
  }, [folderId, fetchFiles]);

  // The list already belongs to one folder, so the name is not repeated per row
  const namedFiles = allFiles.map((file) => ({
    ...file,
    displayName: file.originalName || file.name,
  }));

  // Filter, then search, then sort
  const filteredFiles = filterFiles(namedFiles, { showRecent, showStarred });
  const searchedFiles = searchFiles(filteredFiles, searchQuery);
  const sortedFiles = sortItems(searchedFiles, sortBy, sortOrder);

  return {
    files: sortedFiles,
    isLoading: isInitialLoading,
    error,
    refetch: () => fetchFiles(folderId),
    totalFiles: namedFiles.length,
    filteredCount: searchedFiles.length,
    activeFilters: { showRecent, showStarred },
    searchQuery,
  };
};