import { useState } from "react";
import { prepareFileRequestData } from '@/utils/formScroll';
import { showErrorToast } from '@/lib/toast';

export const useFileRequestSubmit = (formData, onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const requestData = prepareFileRequestData(formData);

      const res = await fetch('/api/files/request', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to create request');
      }

      // Build the shareable link on the client using the returned token
      const link = `${window.location.origin}/request/${result.request.token}`;
      onSuccess(link);
    } catch (error) {
      console.error('Failed to create request:', error);
      showErrorToast(error.message || 'Failed to create request');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};