"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import useTransferStore from '@/store/features/transfer/transferStore';
import { api } from '@/lib/fetchWithAuth';
import { showErrorToast } from '@/lib/toast';
import { useDeleteTransfer } from '@/hooks/transfers/useDeleteTransfer';
import { TRANSFER_SEARCH_DEBOUNCE_MS } from '@/utils/constants/transferConstants';

export const useTransfers = ({ tab = 'sent', status = 'all', search = '' } = {}) => {
    const [transfers, setTransfers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [nextCursor, setNextCursor] = useState(null);
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    // Lets a late page response be discarded once the filters have moved on
    const requestId = useRef(0);

    // Bumped by the create modal so a new transfer shows up without a reload
    const transfersVersion = useTransferStore((state) => state.transfersVersion);

    // Removes a deleted transfer locally instead of refetching the whole list
    const handleDeleted = useCallback((transfer) => {
        setTransfers((prev) => prev.filter((item) => item.id !== transfer.id));
    }, []);

    const { deleteTransfer, deletingId } = useDeleteTransfer({ onDeleted: handleDeleted });

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), TRANSFER_SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [search]);

    // Shared by the first page and every later one, which differ only by cursor
    const fetchPage = useCallback(async (cursor) => {
        const params = new URLSearchParams({ tab, status });
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (cursor) params.set('cursor', cursor);

        const response = await api.get(`/api/transfers?${params.toString()}`);
        const data = await response.json();

        if (!response.ok || !data?.success) {
            throw new Error(data?.message || 'Failed to load transfers');
        }

        return data;
    }, [tab, status, debouncedSearch]);

    useEffect(() => {
        requestId.current += 1;
        const currentRequest = requestId.current;

        const load = async () => {
            setIsLoading(true);

            try {
                const data = await fetchPage(null);

                // A newer request may have finished first, so drop stale results
                if (currentRequest !== requestId.current) return;

                setTransfers(data.transfers || []);
                setNextCursor(data.nextCursor || null);
            } catch (error) {
                console.error('Error loading transfers:', error);

                if (currentRequest !== requestId.current) return;

                setTransfers([]);
                setNextCursor(null);

                // A dead session already redirects to login inside fetchWithAuth
                if (error.message !== 'Session expired') {
                    showErrorToast(error.message || 'Failed to load transfers');
                }
            } finally {
                if (currentRequest === requestId.current) setIsLoading(false);
            }
        };

        load();
    }, [fetchPage, transfersVersion]);

    const loadMore = useCallback(async () => {
        if (!nextCursor || isLoadingMore) return;

        const currentRequest = requestId.current;
        setIsLoadingMore(true);

        try {
            const data = await fetchPage(nextCursor);

            // The filters may have changed while this page was in flight
            if (currentRequest !== requestId.current) return;

            setTransfers((prev) => [...prev, ...(data.transfers || [])]);
            setNextCursor(data.nextCursor || null);
        } catch (error) {
            console.error('Error loading more transfers:', error);

            if (error.message !== 'Session expired') {
                showErrorToast(error.message || 'Failed to load more transfers');
            }
        } finally {
            setIsLoadingMore(false);
        }
    }, [fetchPage, nextCursor, isLoadingMore]);

    return {
        transfers,
        isLoading,
        isLoadingMore,
        hasMore: Boolean(nextCursor),
        loadMore,
        deletingId,
        deleteTransfer,
    };
};