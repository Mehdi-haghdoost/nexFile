import { useEffect, useState } from 'react';
import useFilesStore from '@/store/features/files/filesStore';
import { showErrorToast } from '@/lib/toast';

export const useFiles = (folderId = null) => {
  const { 
    allFiles, 
    isLoading, 
    error, 
    fetchFiles, 
    setLoading 
  } = useFilesStore();
  
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

  return {
    files: allFiles,
    isLoading: isInitialLoading,
    error,
    refetch: () => fetchFiles(folderId)
  };
};