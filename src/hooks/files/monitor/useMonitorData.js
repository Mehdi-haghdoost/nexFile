'use client';
import { useState, useEffect, useCallback } from 'react';
import useMonitorStore from '@/store/features/monitor/monitorStore';

export const useMonitorData = (tab = 'Viewer') => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refetch whenever a file is sent from the modal
  const refreshKey = useMonitorStore((s) => s.refreshKey);

  const fetchRows = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/files/monitor?tab=${tab}`, {
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load monitoring data');
      }

      setRows(data.rows || []);
    } catch (err) {
      setError(err.message);
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows, refreshKey]);

  return { rows, isLoading, error, refetch: fetchRows };
};

export default useMonitorData;