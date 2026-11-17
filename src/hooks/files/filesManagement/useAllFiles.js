import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/fetchWithAuth';
import { showErrorToast } from '@/lib/toast';

// Reaches across every folder, unlike the paged files store; enabled false holds the request until a dialog opens
const useAllFiles = ({ mimeType, enabled = true } = {}) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get('/api/files?scope=all');

      if (!response.ok) {
        throw new Error('Failed to load files');
      }

      const data = await response.json();
      const all = data.files || [];

      setFiles(mimeType ? all.filter((file) => file.mimeType === mimeType) : all);
    } catch (err) {
      // fetchWithAuth already redirects on an expired session, so a toast would land on the login page
      if (err.message === 'Session expired') return;

      console.error('Error loading files:', err);
      setError(err.message);
      showErrorToast('Failed to load files');
    } finally {
      setIsLoading(false);
    }
  }, [mimeType]);

  // Loads when enabled, and again each time it is enabled anew
  useEffect(() => {
    if (enabled) fetchAllFiles();
  }, [fetchAllFiles, enabled]);

  return { files, isLoading, error, refetch: fetchAllFiles };
};

export default useAllFiles;