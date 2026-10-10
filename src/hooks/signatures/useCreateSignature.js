import { useState } from 'react';
import { api } from '@/lib/fetchWithAuth';
import useSignaturesStore from '@/store/features/signatures/signaturesStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

// Files travel as base64 because the signature endpoint takes JSON
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const useCreateSignature = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { addSignature } = useSignaturesStore();

  const createSignature = async (signatureData) => {
    try {
      setIsCreating(true);

      const { name, type, data, isDefault = false } = signatureData;

      if (!name || !type || !data) {
        throw new Error('Missing required fields');
      }

      // A typed signature carries its text, its font and the image rendered from both
      if (type === 'type' && !data.image) {
        throw new Error('Could not render the typed signature');
      }

      const dataToSend = type === 'upload' && data instanceof File
        ? await fileToBase64(data)
        : data;

      const response = await api.post('/api/signatures', {
        name,
        type,
        data: dataToSend,
        isDefault,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create signature');
      }

      const result = await response.json();
      addSignature(result.signature);
      showSuccessToast('Signature created successfully');

      return { success: true, signature: result.signature };
    } catch (err) {
      console.error('Error creating signature:', err);
      showErrorToast(err.message || 'Failed to create signature');
      return { success: false, error: err.message };
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createSignature,
    isCreating,
  };
};

export default useCreateSignature;