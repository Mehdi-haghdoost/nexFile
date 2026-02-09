import { useEffect, useState } from 'react';
import useFilesStore from '@/store/features/files/filesStore';
import useFoldersStore from '@/store/features/folders/foldersStore';
import { showErrorToast } from '@/lib/toast';
import useSortStore from '@/store/ui/sortStore';
import useFilterStore from '@/store/ui/filterStore';
import { sortItems } from '@/utils/helpers/sortHelpers';
import { filterFiles } from '@/utils/helpers/filterHelpers';

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

  // ✅ Apply filtering with multiple criteria
  const filteredFiles = filterFiles(enrichedFiles, { showRecent, showStarred });

  // ✅ Apply sorting after filtering
  const sortedFiles = sortItems(filteredFiles, sortBy, sortOrder);

  return {
    files: sortedFiles,
    isLoading: isInitialLoading,
    error,
    refetch: () => fetchFiles(folderId),
    // ✅ Return filter info
    totalFiles: enrichedFiles.length,
    filteredCount: filteredFiles.length,
    activeFilters: { showRecent, showStarred },
  };
};