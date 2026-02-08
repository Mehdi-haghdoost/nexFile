// import { useEffect, useState } from 'react';
// import useFilesStore from '@/store/features/files/filesStore';
// import { showErrorToast } from '@/lib/toast';

// export const useFiles = (folderId = null) => {
//   const { 
//     allFiles, 
//     isLoading, 
//     error, 
//     fetchFiles, 
//     setLoading 
//   } = useFilesStore();
  
//   const [isInitialLoading, setIsInitialLoading] = useState(true);

//   useEffect(() => {
//     const loadFiles = async () => {
//       setLoading(true);
//       setIsInitialLoading(true);

//       const result = await fetchFiles(folderId);

//       if (!result.success) {
//         showErrorToast(result.error);
//       }

//       setIsInitialLoading(false);
//     };

//     loadFiles();
//   }, [folderId, fetchFiles, setLoading]);

//   return {
//     files: allFiles,
//     isLoading: isInitialLoading,
//     error,
//     refetch: () => fetchFiles(folderId)
//   };
// };

import { useEffect, useState } from 'react';
import useFilesStore from '@/store/features/files/filesStore';
import useFoldersStore from '@/store/features/folders/foldersStore';
import { showErrorToast } from '@/lib/toast';

export const useFiles = (folderId = null) => {
  const { 
    allFiles, 
    isLoading, 
    error, 
    fetchFiles, 
    setLoading 
  } = useFilesStore();

  const { folders } = useFoldersStore(); // ✅ Get folders to resolve names
  
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

  return {
    files: enrichedFiles,
    isLoading: isInitialLoading,
    error,
    refetch: () => fetchFiles(folderId)
  };
};