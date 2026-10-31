'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/fetchWithAuth';
import useMonitorStore from '@/store/features/monitor/monitorStore';
import useTransferStore from '@/store/features/transfer/transferStore';

export const useMonitorSummary = () => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lets a late response be discarded once a newer request has started
  const requestId = useRef(0);

  // Refetch on the same signals as the monitor table, so the numbers and rows stay in step
  const refreshKey = useMonitorStore((s) => s.refreshKey);
  const transfersVersion = useTransferStore((s) => s.transfersVersion);

  const fetchSummary = useCallback(async () => {
    requestId.current += 1;
    const currentRequest = requestId.current;

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get('/api/transfers/activity/summary');

      // A server error page is not JSON, so it falls through to the generic message
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success || !data.summary) {
        throw new Error(data?.message || 'Failed to load the summary');
      }

      // A newer request may have finished first, so drop stale results
      if (currentRequest !== requestId.current) return;

      setSummary(data.summary);
    } catch (err) {
      if (currentRequest !== requestId.current) return;

      // A dead session already redirects to login inside fetchWithAuth
      if (err.message === 'Session expired') return;

      console.error('Error loading transfer summary:', err);
      setError(err.message || 'Failed to load the summary');
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary, refreshKey, transfersVersion]);

  return { summary, isLoading, error, refetch: fetchSummary };
};

export default useMonitorSummary;