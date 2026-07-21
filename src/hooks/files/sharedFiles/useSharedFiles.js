'use client';
import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { api } from '@/lib/fetchWithAuth';

// Add formatted date/time fields so useSorting (keys: 'date','time') keeps working
const normalizeItem = (item) => {
  const shared = item.sharedAt ? new Date(item.sharedAt) : null;

  return {
    ...item,
    date: shared ? format(shared, 'yyyy/MM/dd') : '',
    time: shared ? format(shared, 'h:mm a') : '',
    sharedByName: item.sharedBy?.name || 'Unknown',
    sharedByImage: item.sharedBy?.image || null,
  };
};

const useSharedFiles = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSharedFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get('/api/files/shared');
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load shared files');
      }

      setItems((data.items || []).map(normalizeItem));
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSharedFiles();
  }, [fetchSharedFiles]);

  return { items, isLoading, error, refetch: fetchSharedFiles };
};

export default useSharedFiles;