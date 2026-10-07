import { useState } from "react";
import { prepareFileRequestData } from '@/utils/formScroll';
import { api } from '@/lib/fetchWithAuth';
import useFileRequestStore from '@/store/features/fileRequests/fileRequestStore';
import { showErrorToast } from '@/lib/toast';

export const useFileRequestSubmit = (formData, onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const refreshRequests = useFileRequestStore((state) => state.refreshRequests);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Guard against a double submit while a request is already running
    if (isLoading) return;

    setIsLoading(true);

    try {
      const requestData = prepareFileRequestData(formData);

      // Refreshes and retries on a 401, which a long-open modal can hit
      const res = await api.post('/api/files/request', requestData);
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to create request');
      }

      // Only after the server confirmed, so a failed create never refreshes the list
      refreshRequests();

      // Build the shareable link on the client using the returned token
      const link = `${window.location.origin}/request/${result.request.token}`;
      onSuccess(link);
    } catch (error) {
      console.error('Failed to create request:', error);

      // A dead session already redirects to login inside fetchWithAuth
      if (error.message !== 'Session expired') {
        showErrorToast(error.message || 'Failed to create request');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};