'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/fetchWithAuth';
import useTransferStore from '@/store/features/transfer/transferStore';

// What the section shows before the server has said anything needs attention
const NO_ATTENTION = { items: [], total: 0 };

// Keeps only a well-formed attention list, so a malformed response hides the section instead of breaking it
const readAttention = (attention) => ({
  items: Array.isArray(attention?.items) ? attention.items : [],
  total: Number.isFinite(attention?.total) ? attention.total : 0,
});

// The period the cards count when none is chosen, matching the server's default
export const DEFAULT_SUMMARY_WINDOW = 7;

export const useMonitorSummary = (windowDays = DEFAULT_SUMMARY_WINDOW) => {
  const [payload, setPayload] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Lets a late response be discarded once a newer request has started
  const requestId = useRef(0);

  // Read when a load starts, so a refresh always asks for the period currently chosen
  const windowRef = useRef(windowDays);
  windowRef.current = windowDays;

  // Refetch on the same signals as the monitor table, so the numbers and rows stay in step
  const transfersVersion = useTransferStore((s) => s.transfersVersion);

  // A quiet load keeps the current figures on screen; resolves to false only when this load failed
  const fetchSummary = useCallback(async ({ silent = false } = {}) => {
    requestId.current += 1;
    const currentRequest = requestId.current;

    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
      setError(null);
    }

    try {
      const params = new URLSearchParams({ days: String(windowRef.current) });
      const res = await api.get(`/api/transfers/activity/summary?${params.toString()}`);

      // A server error page is not JSON, so it falls through to the generic message
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success || !data.summary) {
        throw new Error(data?.message || 'Failed to load the summary');
      }

      // A newer request may have finished first, so drop stale results; that one reports instead
      if (currentRequest !== requestId.current) return true;

      setPayload({
        summary: data.summary,
        attention: readAttention(data.attention),
        // Unknown rather than zero when missing, so the empty state never shows by mistake
        totalTransfers: Number.isFinite(data.totalTransfers) ? data.totalTransfers : null,
      });
      setError(null);
      return true;
    } catch (err) {
      if (currentRequest !== requestId.current) return true;

      // A dead session already redirects to login inside fetchWithAuth
      if (err.message === 'Session expired') return true;

      console.error('Error loading transfer summary:', err);

      // A failed quiet load leaves the figures already on screen in place
      if (!silent) setError(err.message || 'Failed to load the summary');
      return false;
    } finally {
      if (currentRequest === requestId.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  // A new period reloads too; the figures on screen stay until the new ones arrive
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary, transfersVersion, windowDays]);

  // A normal reload, as the retry buttons use it, whatever arguments a click handler passes
  const refetch = useCallback(() => fetchSummary(), [fetchSummary]);

  // A quiet reload for refreshes, resolving to false when it failed
  const refresh = useCallback(() => fetchSummary({ silent: true }), [fetchSummary]);

  return {
    summary: payload?.summary ?? null,
    attention: payload?.attention ?? NO_ATTENTION,
    totalTransfers: payload?.totalTransfers ?? null,
    isLoading,
    isRefreshing,
    error,
    refetch,
    refresh,
  };
};

export default useMonitorSummary;