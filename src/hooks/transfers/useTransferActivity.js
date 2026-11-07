"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/fetchWithAuth';

// Ignores focus-triggered refreshes that fire more often than this, like the details hook
const MIN_REFRESH_GAP = 30 * 1000;

const EMPTY = { stats: null, events: [], nextCursor: null };

// Reads one activity response, failing with the server's message when it is not a success
const readActivity = async (response, fallback) => {
    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success) {
        throw new Error(data?.message || fallback);
    }

    return {
        stats: data.stats || null,
        events: Array.isArray(data.events) ? data.events : [],
        nextCursor: data.nextCursor || null,
    };
};

// Loads a transfer's recorded figures and its activity timeline, 20 events at a time
export const useTransferActivity = (id) => {
    const [activity, setActivity] = useState(EMPTY);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loadMoreError, setLoadMoreError] = useState(null);

    // Lets a late response be discarded once a newer request has started
    const requestId = useRef(0);
    const lastLoadedAt = useRef(0);

    const load = useCallback(async ({ silent = false } = {}) => {
        if (!id) return;

        requestId.current += 1;
        const currentRequest = requestId.current;
        lastLoadedAt.current = Date.now();

        if (!silent) {
            setIsLoading(true);
            setError(null);
        }

        try {
            const response = await api.get(`/api/transfers/${encodeURIComponent(id)}/activity`);
            const next = await readActivity(response, 'Failed to load activity');

            if (currentRequest !== requestId.current) return;

            setActivity((prev) => {
                const known = new Set(prev.events.map((event) => event.id));
                const overlaps = next.events.some((event) => known.has(event.id));

                // A refresh keeps the older pages already loaded when the new first page joins up with them
                if (silent && overlaps) {
                    const fresh = next.events.filter((event) => !known.has(event.id));
                    return { stats: next.stats || prev.stats, events: [...fresh, ...prev.events], nextCursor: prev.nextCursor };
                }

                return next;
            });

            setError(null);
            setLoadMoreError(null);
        } catch (err) {
            if (currentRequest !== requestId.current) return;

            // A dead session already redirects to login inside fetchWithAuth
            if (err.message === 'Session expired') return;

            console.error('Error loading transfer activity:', err);

            // A silent refresh keeps whatever is already on screen rather than replacing it with an error
            if (!silent) setError(err.message || 'Failed to load activity');
        } finally {
            if (currentRequest === requestId.current && !silent) setIsLoading(false);
        }
    }, [id]);

    const loadMore = useCallback(async () => {
        if (!id || !activity.nextCursor || isLoadingMore) return;

        // A refresh that starts meanwhile replaces the list, so this page would no longer fit
        const startedWith = requestId.current;

        setIsLoadingMore(true);
        setLoadMoreError(null);

        try {
            const params = new URLSearchParams({ before: activity.nextCursor });
            const response = await api.get(`/api/transfers/${encodeURIComponent(id)}/activity?${params.toString()}`);
            const next = await readActivity(response, 'Failed to load older activity');

            if (startedWith !== requestId.current) return;

            setActivity((prev) => {
                const known = new Set(prev.events.map((event) => event.id));
                return {
                    ...prev,
                    events: [...prev.events, ...next.events.filter((event) => !known.has(event.id))],
                    nextCursor: next.nextCursor,
                };
            });
        } catch (err) {
            if (err.message === 'Session expired') return;

            console.error('Error loading older transfer activity:', err);
            if (startedWith === requestId.current) setLoadMoreError(err.message || 'Failed to load older activity');
        } finally {
            setIsLoadingMore(false);
        }
    }, [id, activity.nextCursor, isLoadingMore]);

    useEffect(() => {
        load();
    }, [load]);

    // New views and downloads arrive while the page sits open, so returning to the tab refreshes them
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState !== 'visible') return;
            if (Date.now() - lastLoadedAt.current < MIN_REFRESH_GAP) return;

            load({ silent: true });
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [load]);

    return {
        stats: activity.stats,
        events: activity.events,
        hasMore: Boolean(activity.nextCursor),
        isLoading,
        error,
        isLoadingMore,
        loadMoreError,
        loadMore,
        refresh: load,
    };
};