"use client";

import { useCallback, useEffect, useState } from 'react';
import useTransferStore from '@/store/features/transfer/transferStore';
import { api } from '@/lib/fetchWithAuth';
import { showErrorToast } from '@/lib/toast';
import { useDeleteTransfer } from '@/hooks/transfers/useDeleteTransfer';
import { TRANSFER_SEARCH_DEBOUNCE_MS } from '@/utils/constants/transferConstants';

export const useTransfers = ({ tab = 'sent', status = 'all', search = '' } = {}) => {
    const [transfers, setTransfers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [debouncedSearch, setDebouncedSearch] = useState(search);

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

    useEffect(() => {
        let isCurrent = true;

        const load = async () => {
            setIsLoading(true);

            try {
                const params = new URLSearchParams({ tab, status });
                if (debouncedSearch) params.set('search', debouncedSearch);

                // Refreshes and retries on a 401, which a cold page load with an expired token hits
                const response = await api.get(`/api/transfers?${params.toString()}`);
                const data = await response.json();

                if (!response.ok || !data?.success) {
                    throw new Error(data?.message || 'Failed to load transfers');
                }

                // A newer request may have finished first, so drop stale results
                if (isCurrent) setTransfers(data.transfers || []);
            } catch (error) {
                console.error('Error loading transfers:', error);

                if (isCurrent) {
                    setTransfers([]);

                    // A dead session already redirects to login inside fetchWithAuth
                    if (error.message !== 'Session expired') {
                        showErrorToast(error.message || 'Failed to load transfers');
                    }
                }
            } finally {
                if (isCurrent) setIsLoading(false);
            }
        };

        load();

        return () => { isCurrent = false; };
    }, [tab, status, debouncedSearch, transfersVersion]);

    return { transfers, isLoading, deletingId, deleteTransfer };
};