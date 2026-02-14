import { useState } from 'react';
import { api } from '@/lib/fetchWithAuth';
import useSignaturesStore from '@/store/features/signatures/signaturesStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { showConfirmDialog } from '@/lib/sweetAlert';

const useDeleteSignature = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { removeSignature } = useSignaturesStore();

  const deleteSignature = async (signatureId) => {
    try {
      const confirmed = await showConfirmDialog({
        title: 'Delete Signature?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
      });

      if (!confirmed) {
        return { success: false, cancelled: true };
      }

      setIsDeleting(true);

      const response = await api.delete(`/api/signatures/${signatureId}`);

      if (!response.ok) {
        throw new Error('Failed to delete signature');
      }

      removeSignature(signatureId);
      showSuccessToast('Signature deleted successfully');
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting signature:', err);
      showErrorToast('Failed to delete signature');
      return { success: false, error: err.message };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteSignature,
    isDeleting,
  };
};

export default useDeleteSignature;