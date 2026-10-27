// import { useState } from 'react';
// import { usePathname } from 'next/navigation';
// import { api } from '@/lib/fetchWithAuth';
// import { showSuccessToast, showErrorToast } from '@/lib/toast';
// import useFilesStore from '@/store/features/files/filesStore';
// import useFoldersStore from '@/store/features/folders/foldersStore';
// import useBillingStore from '@/store/features/billing/billingStore';

// // Only /folder/<id> names a folder, so every other route is the root level
// const readFolderIdFromPath = (pathname = '') => {
//   const match = pathname.match(/^\/folder\/([^/?#]+)/);
//   return match ? match[1] : null;
// };

// const useApplySignature = () => {
//   const pathname = usePathname();
//   const [isApplying, setIsApplying] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [step, setStep] = useState('');

//   // The signed copy changes counts, listings and storage, so the level being viewed is refetched
//   const refreshAfterSigning = () => {
//     const currentFolderId = readFolderIdFromPath(pathname);

//     useFoldersStore.getState().invalidateFolders();

//     Promise.allSettled([
//       useFoldersStore.getState().fetchFolders(currentFolderId, { force: true }),
//       useFilesStore.getState().fetchFiles(currentFolderId),
//       useBillingStore.getState().fetchBilling({ force: true }),
//     ]);
//   };

//   const applySignature = async ({ pdfId, signatureId }) => {
//     if (!pdfId || !signatureId) {
//       showErrorToast('Please select both a PDF and a signature');
//       return { success: false };
//     }

//     setIsApplying(true);
//     setProgress(40);
//     setStep('Stamping the signature onto the PDF...');

//     try {
//       const response = await api.post('/api/signatures/apply', { pdfId, signatureId });
//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(data.message || 'Failed to apply signature');
//       }

//       setProgress(100);
//       setStep('Finished');
//       showSuccessToast(`Signature applied. New file: ${data.file.name}`);

//       refreshAfterSigning();

//       return { success: true, file: data.file };
//     } catch (err) {
//       setIsApplying(false);
//       setProgress(0);
//       setStep('');

//       if (err.message === 'Session expired') return { success: false };

//       console.error('Error applying signature:', err);
//       showErrorToast(err.message || 'Failed to apply signature');

//       return { success: false, error: err.message };
//     }
//   };

//   return { applySignature, isApplying, progress, step };
// };

// export default useApplySignature;
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/fetchWithAuth';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import useFilesStore from '@/store/features/files/filesStore';
import useFoldersStore from '@/store/features/folders/foldersStore';
import useBillingStore from '@/store/features/billing/billingStore';
import { refreshFolderDetails } from '@/hooks/folders/useFolderDetails';

// Only /folder/<id> names a folder, so every other route is the root level
const readFolderIdFromPath = (pathname = '') => {
  const match = pathname.match(/^\/folder\/([^/?#]+)/);
  return match ? match[1] : null;
};

const useApplySignature = () => {
  const pathname = usePathname();
  const [isApplying, setIsApplying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('');

  // The signed copy changes counts, listings and storage, so everything on screen that shows them is refetched
  const refreshAfterSigning = () => {
    const currentFolderId = readFolderIdFromPath(pathname);

    Promise.allSettled([
      useFoldersStore.getState().refreshLoadedFolders(),
      refreshFolderDetails(),
      useFilesStore.getState().fetchFiles(currentFolderId),
      useBillingStore.getState().fetchBilling({ force: true }),
    ]);
  };

  const applySignature = async ({ pdfId, signatureId }) => {
    if (!pdfId || !signatureId) {
      showErrorToast('Please select both a PDF and a signature');
      return { success: false };
    }

    setIsApplying(true);
    setProgress(40);
    setStep('Stamping the signature onto the PDF...');

    try {
      const response = await api.post('/api/signatures/apply', { pdfId, signatureId });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to apply signature');
      }

      setProgress(100);
      setStep('Finished');
      showSuccessToast(`Signature applied. New file: ${data.file.name}`);

      refreshAfterSigning();

      return { success: true, file: data.file };
    } catch (err) {
      setIsApplying(false);
      setProgress(0);
      setStep('');

      if (err.message === 'Session expired') return { success: false };

      console.error('Error applying signature:', err);
      showErrorToast(err.message || 'Failed to apply signature');

      return { success: false, error: err.message };
    }
  };

  return { applySignature, isApplying, progress, step };
};

export default useApplySignature;