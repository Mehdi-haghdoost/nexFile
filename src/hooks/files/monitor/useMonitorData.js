'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/fetchWithAuth';
import useTransferStore from '@/store/features/transfer/transferStore';
import { showErrorToast } from '@/lib/toast';

// What a failed Load more says, worded for the tab it happened on
const LOAD_MORE_FAILED_MESSAGES = {
  activity: "Couldn't load more activity. Please try again.",
  transfers: "Couldn't load more transfers. Please try again.",
};

// Asks for one page of a tab; a cursor asks for the page after it
const requestPage = async (tab, cursor) => {
  const params = new URLSearchParams({ tab });
  if (cursor) params.set('cursor', cursor);

  const res = await api.get(`/api/transfers/activity?${params.toString()}`);

  // A server error page is not JSON, so it falls through to the generic message
  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    throw new Error(data?.message || 'Failed to load monitoring data');
  }

  return {
    rows: Array.isArray(data.rows) ? data.rows : [],
    nextCursor: typeof data.nextCursor === 'string' ? data.nextCursor : null,
  };
};

export const useMonitorData = (tab = 'activity', { refreshToken = 0 } = {}) => {
  // Rows and error are stored with the tab they belong to, so a tab switch never shows the other tab's rows
  const [result, setResult] = useState({ tab: null, rows: [], error: null, nextCursor: null });
  const [isFetching, setIsFetching] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // The outcome of the latest finished load, tagged with the refresh it answers
  const [settled, setSettled] = useState(null);

  // Lets a late response be discarded once a newer request has started
  const requestId = useRef(0);

  // Mirrors the list for loadMore, which must not start twice or from an outdated cursor
  const resultRef = useRef(result);
  resultRef.current = result;
  const isBusy = useRef(false);
  const isLoadingMoreRef = useRef(false);

  // The newest refresh asked for, read when a load starts so its outcome can be matched to it
  const latestToken = useRef(refreshToken);
  latestToken.current = refreshToken;

  // Bumped after a transfer is created, so the new transfer shows up without a reload
  const transfersVersion = useTransferStore((s) => s.transfersVersion);

  // A quiet load keeps the current rows on screen and only replaces them once new ones arrive; every load starts from the first page
  const fetchRows = useCallback(async ({ silent = false } = {}) => {
    requestId.current += 1;
    const currentRequest = requestId.current;
    const token = latestToken.current;

    // A page still loading belongs to the old list, so its result is dropped by the request check
    isBusy.current = true;
    isLoadingMoreRef.current = false;
    setIsLoadingMore(false);

    if (silent) setIsRefreshing(true);
    else setIsFetching(true);

    try {
      const page = await requestPage(tab, null);

      // A newer request may have finished first, so drop stale results
      if (currentRequest !== requestId.current) return;

      setResult({ tab, rows: page.rows, error: null, nextCursor: page.nextCursor });
      setSettled({ id: currentRequest, token, ok: true });
    } catch (err) {
      if (currentRequest !== requestId.current) return;

      // A dead session already redirects to login inside fetchWithAuth
      if (err.message === 'Session expired') {
        if (!silent) setResult({ tab, rows: [], error: null, nextCursor: null });
        setSettled({ id: currentRequest, token, ok: true });
        return;
      }

      console.error('Error loading monitoring data:', err);

      // A failed quiet load leaves the rows already on screen in place
      if (!silent) setResult({ tab, rows: [], error: err.message || 'Failed to load monitoring data', nextCursor: null });
      setSettled({ id: currentRequest, token, ok: false });
    } finally {
      if (currentRequest === requestId.current) {
        isBusy.current = false;
        setIsFetching(false);
        setIsRefreshing(false);
      }
    }
  }, [tab]);

  // Adds the next page under the rows already shown; waits while the list itself is reloading
  const loadMore = useCallback(async () => {
    const current = resultRef.current;
    if (isBusy.current || isLoadingMoreRef.current) return;
    if (current.tab !== tab || current.error || !current.nextCursor) return;

    const currentRequest = requestId.current;
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);

    try {
      const page = await requestPage(tab, current.nextCursor);

      // A tab switch or refresh since then has replaced the list this page continues
      if (currentRequest !== requestId.current) return;

      setResult((prev) => {
        // Skips any row already shown, so a repeat can never appear twice
        const shown = new Set(prev.rows.map((row) => row.id));
        return { ...prev, rows: [...prev.rows, ...page.rows.filter((row) => !shown.has(row.id))], nextCursor: page.nextCursor };
      });
    } catch (err) {
      if (currentRequest !== requestId.current) return;

      // A dead session already redirects to login inside fetchWithAuth
      if (err.message === 'Session expired') return;

      // The rows already loaded stay, and the button stays so the user can try again
      console.error('Error loading more monitoring data:', err);
      showErrorToast(LOAD_MORE_FAILED_MESSAGES[tab] || LOAD_MORE_FAILED_MESSAGES.activity);
    } finally {
      if (currentRequest === requestId.current) {
        isLoadingMoreRef.current = false;
        setIsLoadingMore(false);
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
    hasMore: isCurrentTab && !result.error && Boolean(result.nextCursor),
    isLoadingMore: isCurrentTab && isLoadingMore,
    loadMore,
  };
};

export default useMonitorData;