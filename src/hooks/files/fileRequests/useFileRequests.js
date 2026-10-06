import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import useModalStore from '@/store/ui/modalStore';
import useSorting from '@/hooks/useSorting';
import { api } from '@/lib/fetchWithAuth';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

// Shape a raw request document into what the table and rows expect
const normalizeRequest = (request) => ({
  id: request._id,
  name: request.title,
  status: request.status,
  // Raw dates are kept alongside the formatted ones, so sorting does not depend on the display format
  createdAt: request.createdAt || null,
  deadline: request.hasDeadline ? request.deadline : null,
  created: request.createdAt ? format(new Date(request.createdAt), 'yyyy/MM/dd') : '',
  expiration:
    request.hasDeadline && request.deadline
      ? format(new Date(request.deadline), 'yyyy/MM/dd')
      : 'No expiration',
  submitters: request.submittersCount || 0,
  uploads: request.uploadsCount || 0,
  token: request.token,
});

export const useFileRequests = () => {
  const [rawData, setRawData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const { openModal } = useModalStore();

  const { sortedData: files, handleSort, sortConfig } = useSorting(
    rawData,
    { key: 'createdAt', direction: 'desc' }
  );

  // Fetch requests from the server, respecting the active filter
  const fetchFileRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Refreshes and retries on a 401, which a cold page load with an expired token hits
      const res = await api.get(`/api/files/request?filter=${activeFilter}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load file requests');
      }

      setRawData((data.requests || []).map(normalizeRequest));
    } catch (err) {
      // A dead session already redirects to login inside fetchWithAuth
      if (err.message !== 'Session expired') setError(err);
      setRawData([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchFileRequests();
  }, [fetchFileRequests]);

  const handleNewRequest = useCallback(() => {
    openModal('fileRequest');
  }, [openModal]);

  // Toggle a request between opened and closed
  const toggleStatus = useCallback(async (id, currentStatus) => {
    const nextStatus = currentStatus === 'opened' ? 'closed' : 'opened';

    try {
      const res = await api.patch(`/api/files/request/${id}`, { status: nextStatus });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to update request');
      }

      showSuccessToast(nextStatus === 'closed' ? 'Request closed' : 'Request reopened');
      fetchFileRequests();
    } catch (err) {
      if (err.message !== 'Session expired') {
        showErrorToast(err.message || 'Failed to update request');
      }
    }
  }, [fetchFileRequests]);

  // Permanently delete a request
  const deleteRequest = useCallback(async (id) => {
    try {
      const res = await api.delete(`/api/files/request/${id}`);
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete request');
      }

      showSuccessToast('Request deleted');
      fetchFileRequests();
    } catch (err) {
      if (err.message !== 'Session expired') {
        showErrorToast(err.message || 'Failed to delete request');
      }
    }
  }, [fetchFileRequests]);

  return {
    files,
    isLoading,
    error,
    activeFilter,
    setActiveFilter,
    sortConfig,
    handleSort,
    handleNewRequest,
    toggleStatus,
    deleteRequest,
    refetch: fetchFileRequests,
  };
};