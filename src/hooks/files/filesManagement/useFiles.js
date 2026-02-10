import { useEffect, useState } from 'react';
import useFilesStore from '@/store/features/files/filesStore';
import useFoldersStore from '@/store/features/folders/foldersStore';
import { showErrorToast } from '@/lib/toast';
import useSortStore from '@/store/ui/sortStore';
import useFilterStore from '@/store/ui/filterStore';
import useSearchStore from '@/store/ui/searchStore';
import { sortItems } from '@/utils/helpers/sortHelpers';
import { filterFiles } from '@/utils/helpers/filterHelpers';
import { searchFiles } from '@/utils/helpers/searchHelpers';

export const useFiles = (folderId = null) => {
  const { 
    allFiles, 
    isLoading, 
    error, 
    fetchFiles, 
    setLoading 
  } = useFilesStore();

  const { folders } = useFoldersStore();
  const { sortBy, sortOrder } = useSortStore();
  const { showRecent, showStarred } = useFilterStore();
  const { searchQuery } = useSearchStore(); // ✅ Add search
  
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true);
      setIsInitialLoading(true);

      const result = await fetchFiles(folderId);

      if (!result.success) {
        showErrorToast(result.error);
      }

      setIsInitialLoading(false);
    };

    loadFiles();
  }, [folderId, fetchFiles, setLoading]);

  // ✅ Enrich files with folder names
  const enrichedFiles = allFiles.map(file => {
    const folder = folders.find(f => f.id === file.folder);
    return {
      ...file,
      folderName: folder?.name || null,
      displayName: folder ? `${folder.name}/${file.originalName || file.name}` : (file.originalName || file.name)
    };
  });

  // ✅ Pipeline: Filter → Search → Sort
  const filteredFiles = filterFiles(enrichedFiles, { showRecent, showStarred });
  const searchedFiles = searchFiles(filteredFiles, searchQuery);
  const sortedFiles = sortItems(searchedFiles, sortBy, sortOrder);

  return {
    files: sortedFiles,
    isLoading: isInitialLoading,
    error,
    refetch: () => fetchFiles(folderId),
    // ✅ Return metadata
    totalFiles: enrichedFiles.length,
    filteredCount: searchedFiles.length,
    activeFilters: { showRecent, showStarred },
    searchQuery,
  };
};