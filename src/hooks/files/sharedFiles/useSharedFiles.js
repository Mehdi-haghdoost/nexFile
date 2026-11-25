'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/fetchWithAuth';

const PAGE_SIZE = 30;
const MAX_PAGE_SIZE = 100;

// Turns a refused or broken response into an error carrying the server's message
const readPage = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || 'Failed to load shared files');
  }

  return data;
};

const buildUrl = ({ tab, filter, sort, order }, limit, cursor) => {
  const params = new URLSearchParams({ tab, filter, sort, order, limit: String(limit) });
  if (cursor) params.set('cursor', cursor);
  return `/api/files/shared?${params.toString()}`;
};

// One tab of the Shared list, read from the server a page at a time in the order asked for
const useSharedFiles = ({ tab, filter, sort, order }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [linksUnavailable, setLinksUnavailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [loadMoreError, setLoadMoreError] = useState(null);

  // Newest list request, so an older answer never replaces a newer list
  const latestRequest = useRef(0);
  // How many rows are showing, so a refresh keeps them in view
  const loadedCount = useRef(0);

  const loadFirstPage = useCallback(async ({ keepItems = false } = {}) => {
    const requestId = ++latestRequest.current;
    const limit = keepItems ? Math.min(Math.max(loadedCount.current, PAGE_SIZE), MAX_PAGE_SIZE) : PAGE_SIZE;

    // A new tab, filter or order starts empty; a refresh keeps the rows until the new ones arrive
    if (!keepItems) {
      setItems([]);
      setTotal(null);
      setNextCursor(null);
      setLinksUnavailable(false);
      loadedCount.current = 0;
    }
    setIsLoading(!keepItems);
    setIsLoadingMore(false);
    setError(null);
    setLoadMoreError(null);

    try {
      const response = await api.get(buildUrl({ tab, filter, sort, order }, limit, null));
      const data = await readPage(response);
      if (requestId !== latestRequest.current) return;

      const pageItems = data.items || [];
      setItems(pageItems);
      setTotal(typeof data.total === 'number' ? data.total : pageItems.length);
      setNextCursor(data.nextCursor || null);
      setLinksUnavailable(Boolean(data.linksUnavailable));
      loadedCount.current = pageItems.length;
    } catch (err) {
      // A dead session already redirects to login inside fetchWithAuth
      if (requestId === latestRequest.current && err.message !== 'Session expired') {
        setError(err.message || 'Something went wrong');
        if (!keepItems) setItems([]);
      }
    } finally {
      if (requestId === latestRequest.current) setIsLoading(false);
    }
  }, [tab, filter, sort, order]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  // Adds the next page under the rows already showing
  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore || isLoading) return;

    const requestId = latestRequest.current;
    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      const response = await api.get(buildUrl({ tab, filter, sort, order }, PAGE_SIZE, nextCursor));
      const data = await readPage(response);
      if (requestId !== latestRequest.current) return;

      // A row already showing is never listed twice
      setItems((current) => {
        const seen = new Set(current.map((item) => item.id));
        const merged = [...current, ...(data.items || []).filter((item) => !seen.has(item.id))];
        loadedCount.current = merged.length;
        return merged;
      });
      setNextCursor(data.nextCursor || null);
    } catch (err) {
      if (requestId === latestRequest.current && err.message !== 'Session expired') {
        setLoadMoreError(err.message || 'Something went wrong');
      }
    } finally {
      if (requestId === latestRequest.current) setIsLoadingMore(false);
    }
  }, [tab, filter, sort, order, nextCursor, isLoadingMore, isLoading]);

  const refresh = useCallback(() => loadFirstPage({ keepItems: true }), [loadFirstPage]);
  const retry = useCallback(() => loadFirstPage(), [loadFirstPage]);

  return {
    items,
    total,
    hasMore: Boolean(nextCursor),
    linksUnavailable,
    isLoading,
    isLoadingMore,
    error,
    loadMoreError,
    loadMore,
    refresh,
    retry,
  };
};

export default useSharedFiles;