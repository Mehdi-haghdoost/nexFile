import { useState, useEffect } from 'react';

export const useSuggestedFiles = (limit = 4) => {
  const [suggestedFiles, setSuggestedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuggestedFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/files/suggested?limit=${limit}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch suggested files');
      }

      const data = await response.json();

      if (data.success && data.files) {
        setSuggestedFiles(data.files);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching suggested files:', err);
      setError(err.message);
      setSuggestedFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestedFiles();
  }, []);

  return {
    suggestedFiles,
    isLoading,
    error,
    refetch: fetchSuggestedFiles,
  };
};