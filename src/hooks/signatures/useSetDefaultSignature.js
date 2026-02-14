import { useState } from 'react';
import { api } from '@/lib/fetchWithAuth';
import useSignaturesStore from '@/store/features/signatures/signaturesStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

const useSetDefaultSignature = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { setDefaultSignature } = useSignaturesStore();

  const setDefault = async (signatureId) => {
    try {
      setIsUpdating(true);

      const response = await api.patch(`/api/signatures/${signatureId}`, {
        isDefault: true,
      });

      if (!response.ok) {
        throw new Error('Failed to set default signature');
      }

      setDefaultSignature(signatureId);
      showSuccessToast('Default signature updated');
      
      return { success: true };
    } catch (err) {
      console.error('Error setting default:', err);
      showErrorToast('Failed to update default signature');
      return { success: false, error: err.message };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    setDefault,
    isUpdating,
  };
};

export default useSetDefaultSignature;