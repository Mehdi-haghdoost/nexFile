import { useState } from 'react';
import { api } from '@/lib/fetchWithAuth';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

const useApplySignature = () => {
  const [isApplying, setIsApplying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('');

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