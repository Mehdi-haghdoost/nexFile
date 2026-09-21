"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/fetchWithAuth';
import { showErrorToast } from '@/lib/toast';
import { TRANSFER_SEARCH_DEBOUNCE_MS } from '@/utils/constants/transferConstants';

// Loads the stored files the NexFile picker can add to a transfer
export const useTransferSources = ({ folderId = '', search = '' } = {}) => {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), TRANSFER_SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        let isCurrent = true;

        const load = async () => {
            setIsLoading(true);

            try {
                const params = new URLSearchParams();
                if (folderId) params.set('folderId', folderId);
                if (debouncedSearch) params.set('search', debouncedSearch);

                const response = await api.get(`/api/transfers/sources?${params.toString()}`);
                const data = await response.json();

                if (!response.ok || !data?.success) {
                    throw new Error(data?.message || 'Failed to load your files');
                }

                // A newer request may have finished first, so drop stale results
                if (isCurrent) setFiles(data.files || []);
            } catch (error) {
                console.error('Error loading transfer sources:', error);

                if (isCurrent) {
                    setFiles([]);

                    // A dead session already redirects to login inside fetchWithAuth
                    if (error.message !== 'Session expired') {
                        showErrorToast(error.message || 'Failed to load your files');
                    }
                }
            } finally {
                if (isCurrent) setIsLoading(false);
            }
        };

        load();

        return () => { isCurrent = false; };
    }, [folderId, debouncedSearch]);

    return { files, isLoading };
};