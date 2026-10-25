import { useEffect } from 'react';
import { api } from '@/lib/fetchWithAuth';
import useSignaturesStore from '@/store/features/signatures/signaturesStore';
import { showErrorToast } from '@/lib/toast';

// Message fetchWithAuth throws once it has already started the redirect to login
const SESSION_EXPIRED_MESSAGE = 'Session expired';

// Shared so components mounting together trigger a single request
let inFlightRequest = null;

const useSignatures = () => {
  const {
    signatures,
    isLoading,
    error,
    setSignatures,
    setLoading,
    setError,
  } = useSignaturesStore();

  const fetchSignatures = () => {
    if (inFlightRequest) return inFlightRequest;

    setLoading(true);
    setError(null);

    inFlightRequest = (async () => {
      try {
        const response = await api.get('/api/signatures');

        if (!response.ok) {
          throw new Error('Failed to fetch signatures');
        }

        const data = await response.json();
        setSignatures(data.signatures);
      } catch (err) {
        setError(err.message);

        // The login redirect is already under way, so a failure toast would be misleading
        if (err.message === SESSION_EXPIRED_MESSAGE) return;

        console.error('Error fetching signatures:', err);
        showErrorToast('Failed to load signatures');
      } finally {
        setLoading(false);
        inFlightRequest = null;
      }
    })();

    return inFlightRequest;
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