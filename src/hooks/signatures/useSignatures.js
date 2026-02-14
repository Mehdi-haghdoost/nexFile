import { useEffect } from 'react';
import { api } from '@/lib/fetchWithAuth';
import useSignaturesStore from '@/store/features/signatures/signaturesStore';
import { showErrorToast } from '@/lib/toast';

const useSignatures = () => {
  const { 
    signatures, 
    isLoading, 
    error,
    setSignatures,
    setLoading,
    setError,
  } = useSignaturesStore();

  const fetchSignatures = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/api/signatures');
      
      if (!response.ok) {
        throw new Error('Failed to fetch signatures');
      }

      const data = await response.json();
      setSignatures(data.signatures);
    } catch (err) {
      console.error('Error fetching signatures:', err);
      setError(err.message);
      showErrorToast('Failed to load signatures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignatures();
  }, []);

  return {
    signatures,
    isLoading,
    error,
    refetch: fetchSignatures,
  };
};

export default useSignatures;