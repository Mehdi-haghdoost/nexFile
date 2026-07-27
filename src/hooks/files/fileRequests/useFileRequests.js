import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import useModalStore from '@/store/ui/modalStore';
import useSorting from '@/hooks/useSorting';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

// Shape a raw request document into what the table/rows expect
const normalizeRequest = (r) => ({
  id: r._id,
  name: r.title,
  status: r.status,
  created: r.createdAt ? format(new Date(r.createdAt), 'yyyy/MM/dd') : '',
  expiration:
    r.hasDeadline && r.deadline
      ? format(new Date(r.deadline), 'yyyy/MM/dd')
      : 'No expiration',
  submitters: r.submittersCount || 0,
  uploads: r.uploadsCount || 0,
  token: r.token,
});

export const useFileRequests = () => {
  const [rawData, setRawData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const { openModal } = useModalStore();

  const { sortedData: files, handleSort, sortConfig } = useSorting(
    rawData,
    { key: 'name', direction: 'asc' }
  );

  // Fetch requests from the server, respecting the active filter
  const fetchFileRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/files/request?filter=${activeFilter}`, {
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load file requests');
      }

      setRawData((data.requests || []).map(normalizeRequest));
    } catch (err) {
      setError(err);
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

  const refetch = useCallback(() => {
    fetchFileRequests();
  }, [fetchFileRequests]);

  // Toggle a request between opened and closed
  const toggleStatus = useCallback(async (id, currentStatus) => {
    const nextStatus = currentStatus === 'opened' ? 'closed' : 'opened';
    try {
      const res = await fetch(`/api/files/request/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to update request');
      }

      showSuccessToast(nextStatus === 'closed' ? 'Request closed' : 'Request reopened');
      fetchFileRequests();
    } catch (err) {
      showErrorToast(err.message || 'Failed to update request');
    }
  }, [fetchFileRequests]);

  // Permanently delete a request
  const deleteRequest = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/files/request/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete request');
      }

      showSuccessToast('Request deleted');
      fetchFileRequests();
    } catch (err) {
      showErrorToast(err.message || 'Failed to delete request');
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
    refetch
  };
};