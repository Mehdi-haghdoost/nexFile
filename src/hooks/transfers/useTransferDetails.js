"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/fetchWithAuth';

// Ignores focus-triggered refreshes that fire more often than this
const MIN_REFRESH_GAP = 30 * 1000;

// Loads one of the caller's transfers for the details page
export const useTransferDetails = (id) => {
    const [transfer, setTransfer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isNotFound, setIsNotFound] = useState(false);
    const [error, setError] = useState(null);

    const lastLoadedAt = useRef(0);

    const load = useCallback(async ({ silent = false } = {}) => {
        if (!id) return;

        if (!silent) setIsLoading(true);
        lastLoadedAt.current = Date.now();

        try {
            const response = await api.get(`/api/transfers/${id}`);
            const data = await response.json();

            // Missing, deleted and someone else's transfer all arrive as 404
            if (response.status === 404) {
                setIsNotFound(true);
                return;
            }

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Failed to load this transfer');
            }

            setTransfer(data.transfer);
            setIsNotFound(false);
            setError(null);
        } catch (err) {
            console.error('Error loading transfer details:', err);

            // A silent refresh keeps whatever is already on screen rather than replacing it with an error
            if (!silent && err.message !== 'Session expired') {
                setError(err.message || 'Failed to load this transfer');
            }
        } finally {
            if (!silent) setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    // View and download counts change while the page sits open, so returning to the tab refreshes them
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState !== 'visible') return;
            if (Date.now() - lastLoadedAt.current < MIN_REFRESH_GAP) return;

            load({ silent: true });
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [load]);

    // Merges an action's returned fields in, keeping ones it does not return such as recipients
    const updateTransfer = useCallback((next) => {
        setTransfer((prev) => (prev ? { ...prev, ...next } : next));
    }, []);

    return { transfer, isLoading, isNotFound, error, updateTransfer, refresh: load };
};