'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/fetchWithAuth';
import useMonitorStore from '@/store/features/monitor/monitorStore';
import useTransferStore from '@/store/features/transfer/transferStore';

export const useMonitorData = (tab = 'activity') => {
  // Rows and error are stored with the tab they belong to, so a tab switch never shows the other tab's rows
  const [result, setResult] = useState({ tab: null, rows: [], error: null });
  const [isFetching, setIsFetching] = useState(true);

  // Lets a late response be discarded once a newer request has started
  const requestId = useRef(0);

  // Refetch whenever a file is sent from the modal
  const refreshKey = useMonitorStore((s) => s.refreshKey);

  // Bumped after a transfer is created, so the new transfer shows up without a reload
  const transfersVersion = useTransferStore((s) => s.transfersVersion);

  const fetchRows = useCallback(async () => {
    requestId.current += 1;
    const currentRequest = requestId.current;

    setIsFetching(true);

    try {
      const params = new URLSearchParams({ tab });
      const res = await api.get(`/api/transfers/activity?${params.toString()}`);

      // A server error page is not JSON, so it falls through to the generic message
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to load monitoring data');
      }

      // A newer request may have finished first, so drop stale results
      if (currentRequest !== requestId.current) return;

      setResult({ tab, rows: Array.isArray(data.rows) ? data.rows : [], error: null });
    } catch (err) {
      if (currentRequest !== requestId.current) return;

      // A dead session already redirects to login inside fetchWithAuth
      if (err.message === 'Session expired') {
        setResult({ tab, rows: [], error: null });
        return;
      }

      console.error('Error loading monitoring data:', err);
      setResult({ tab, rows: [], error: err.message || 'Failed to load monitoring data' });
    } finally {
      if (currentRequest === requestId.current) setIsFetching(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows, refreshKey, transfersVersion]);

  const isCurrentTab = result.tab === tab;

  return {
    rows: isCurrentTab ? result.rows : [],
    isLoading: isFetching || !isCurrentTab,
    error: isCurrentTab ? result.error : null,
    refetch: fetchRows,
  };
};

export default useMonitorData;