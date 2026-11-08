'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/fetchWithAuth';
import useTransferStore from '@/store/features/transfer/transferStore';

export const useMonitorData = (tab = 'activity', { refreshToken = 0 } = {}) => {
  // Rows and error are stored with the tab they belong to, so a tab switch never shows the other tab's rows
  const [result, setResult] = useState({ tab: null, rows: [], error: null });
  const [isFetching, setIsFetching] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // The outcome of the latest finished load, tagged with the refresh it answers
  const [settled, setSettled] = useState(null);

  // Lets a late response be discarded once a newer request has started
  const requestId = useRef(0);

  // The newest refresh asked for, read when a load starts so its outcome can be matched to it
  const latestToken = useRef(refreshToken);
  latestToken.current = refreshToken;

  // Bumped after a transfer is created, so the new transfer shows up without a reload
  const transfersVersion = useTransferStore((s) => s.transfersVersion);

  // A quiet load keeps the current rows on screen and only replaces them once new ones arrive
  const fetchRows = useCallback(async ({ silent = false } = {}) => {
    requestId.current += 1;
    const currentRequest = requestId.current;
    const token = latestToken.current;

    if (silent) setIsRefreshing(true);
    else setIsFetching(true);

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
      setSettled({ id: currentRequest, token, ok: true });
    } catch (err) {
      if (currentRequest !== requestId.current) return;

      // A dead session already redirects to login inside fetchWithAuth
      if (err.message === 'Session expired') {
        if (!silent) setResult({ tab, rows: [], error: null });
        setSettled({ id: currentRequest, token, ok: true });
        return;
      }

      console.error('Error loading monitoring data:', err);

      // A failed quiet load leaves the rows already on screen in place
      if (!silent) setResult({ tab, rows: [], error: err.message || 'Failed to load monitoring data' });
      setSettled({ id: currentRequest, token, ok: false });
    } finally {
      if (currentRequest === requestId.current) {
        setIsFetching(false);
        setIsRefreshing(false);
      }
    }
  }, [tab]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows, transfersVersion]);

  // A new refresh token reloads the current tab quietly; the first render is already covered above
  const fetchRowsRef = useRef(fetchRows);
  fetchRowsRef.current = fetchRows;
  const isFirstToken = useRef(true);

  useEffect(() => {
    if (isFirstToken.current) {
      isFirstToken.current = false;
      return;
    }
    fetchRowsRef.current({ silent: true });
  }, [refreshToken]);

  // A normal reload for the Try again button, whatever arguments a click handler passes
  const refetch = useCallback(() => fetchRows(), [fetchRows]);

  const isCurrentTab = result.tab === tab;

  return {
    rows: isCurrentTab ? result.rows : [],
    isLoading: isFetching || !isCurrentTab,
    error: isCurrentTab ? result.error : null,
    isRefreshing,
    settled,
    refetch,
  };
};

export default useMonitorData;