'use client';
import { useState, useEffect, useCallback } from 'react';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export const useActivity = (category = 'all') => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const fetchActivity = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/activity?category=${category}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load activity');
      }
      setActivities(data.activities || []);
    } catch (err) {
      setError(err.message);
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const clearActivity = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/activity', {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Failed to clear activity');
      showSuccessToast('Activity log cleared');
      fetchActivity();
    } catch (err) {
      showErrorToast(err.message || 'Failed to clear activity');
    }
  }, [fetchActivity]);

  // Download the current view as a CSV file
  const exportActivity = useCallback(async () => {
    setIsExporting(true);
    try {
      const res = await fetch(`/api/admin/activity/export?category=${category}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to export activity');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showSuccessToast('Activity log exported');
    } catch (err) {
      showErrorToast(err.message || 'Failed to export activity');
    } finally {
      setIsExporting(false);
    }
  }, [category]);

  return {
    activities,
    isLoading,
    error,
    isExporting,
    refetch: fetchActivity,
    clearActivity,
    exportActivity,
  };
};

export default useActivity;