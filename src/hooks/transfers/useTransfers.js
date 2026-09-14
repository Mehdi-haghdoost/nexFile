"use client";

import { useCallback, useEffect, useState } from 'react';
import useTransferStore from '@/store/features/transfer/transferStore';
import { api } from '@/lib/fetchWithAuth';
import { showConfirmDialog } from '@/lib/sweetAlert';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { TRANSFER_SEARCH_DEBOUNCE_MS } from '@/utils/constants/transferConstants';

export const useTransfers = ({ tab = 'sent', status = 'all', search = '' } = {}) => {
    const [transfers, setTransfers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    // Bumped by the create modal so a new transfer shows up without a reload
    const transfersVersion = useTransferStore((state) => state.transfersVersion);

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

                // api.get refreshes and retries on a 401, which is what a page
                // load with an expired access token hits before anything else
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

                    // A dead session already redirects to login inside
                    // fetchWithAuth, so a toast would flash on the way out
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

    const deleteTransfer = useCallback(async (transfer) => {
        // Guard against a second delete while a request is already running
        if (deletingId || !transfer?.id) return false;

        const confirmed = await showConfirmDialog({
            title: 'Delete this transfer?',
            text: `"${transfer.groupName}" will stop being available at its share link.`,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Keep it',
        });

        if (!confirmed) return false;

        setDeletingId(transfer.id);

        try {
            const response = await api.delete(`/api/transfers/${transfer.id}`);
            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Failed to delete transfer');
            }

            setTransfers((prev) => prev.filter((item) => item.id !== transfer.id));
            showSuccessToast('Transfer deleted');

            return true;
        } catch (error) {
            console.error('Error deleting transfer:', error);

            if (error.message !== 'Session expired') {
                showErrorToast(error.message || 'Failed to delete transfer');
            }
            return false;
        } finally {
            setDeletingId(null);
        }
    }, [deletingId]);

    return { transfers, isLoading, deletingId, deleteTransfer };
};