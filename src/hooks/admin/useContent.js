'use client';
import { useState, useEffect, useCallback } from 'react';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export const useContent = (activeTab) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content?tab=${activeTab}`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load content');
      }
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Archive or unarchive a folder, then refresh the list
  const setArchived = useCallback(async (id, isArchived) => {
    try {
      const res = await fetch(`/api/admin/content/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Failed to update folder');
      showSuccessToast(isArchived ? 'Folder archived' : 'Folder unarchived');
      fetchContent();
    } catch (err) {
      showErrorToast(err.message || 'Failed to update folder');
    }
  }, [fetchContent]);

  return { items, isLoading, error, refetch: fetchContent, setArchived };
};

export default useContent;