import { useEffect, useState } from 'react';
import useFoldersStore from '@/store/features/folders/foldersStore';
import { api } from '@/lib/fetchWithAuth';
import { showErrorToast } from '@/lib/toast';

export const useFolders = (parentFolder = null) => {
  const { 
    folders, 
    isLoading, 
    error, 
    setFolders,
    setLoading 
  } = useFoldersStore();
  
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadFolders = async () => {
      setLoading(true);
      setIsInitialLoading(true);

      try {
        const params = new URLSearchParams();
        if (parentFolder) {
          params.append('parentFolder', parentFolder);
        }

        const response = await api.get(`/api/folders?${params.toString()}`);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch folders');
        }

        const data = await response.json();
        setFolders(data.folders);
      } catch (error) {
        showErrorToast(error.message);
      } finally {
        setIsInitialLoading(false);
        setLoading(false);
      }
    };

    loadFolders();
  }, [parentFolder, setFolders, setLoading]);

  return {
    folders,
    isLoading: isInitialLoading,
    error,
  };
};