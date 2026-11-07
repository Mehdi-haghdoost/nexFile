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

export const useMonitorSummary = () => {
  const [payload, setPayload] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lets a late response be discarded once a newer request has started
  const requestId = useRef(0);

  // Refetch on the same signals as the monitor table, so the numbers and rows stay in step
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

      setPayload({
        summary: data.summary,
        attention: readAttention(data.attention),
        // Unknown rather than zero when missing, so the empty state never shows by mistake
        totalTransfers: Number.isFinite(data.totalTransfers) ? data.totalTransfers : null,
      });
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
  }, [fetchSummary, transfersVersion]);

  return {
    summary: payload?.summary ?? null,
    attention: payload?.attention ?? NO_ATTENTION,
    totalTransfers: payload?.totalTransfers ?? null,
    isLoading,
    error,
    refetch: fetchSummary,
  };
};

export default useMonitorSummary;