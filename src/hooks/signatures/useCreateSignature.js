import { useState } from 'react';
import { api } from '@/lib/fetchWithAuth';
import useSignaturesStore from '@/store/features/signatures/signaturesStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

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

      let dataToSend = data;

      // For draw: canvas toDataURL base64
      if (type === 'draw') {
        dataToSend = data; // Already base64 from canvas
      }

      // For type: send object directly
      if (type === 'type') {
        dataToSend = data; // { text, fontId }
      }

      // For upload: convert File to base64
      if (type === 'upload' && data instanceof File) {
        dataToSend = await fileToBase64(data);
      }

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

// Helper: Convert File to Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default useCreateSignature;