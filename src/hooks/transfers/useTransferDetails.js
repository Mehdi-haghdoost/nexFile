"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/fetchWithAuth';

// Loads one of the caller's transfers for the details page
export const useTransferDetails = (id) => {
    const [transfer, setTransfer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isNotFound, setIsNotFound] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        let isCurrent = true;

        const load = async () => {
            setIsLoading(true);
            setIsNotFound(false);
            setError(null);

            try {
                const response = await api.get(`/api/transfers/${id}`);
                const data = await response.json();

                // Missing, deleted and someone else's transfer all arrive as 404
                if (response.status === 404) {
                    if (isCurrent) setIsNotFound(true);
                    return;
                }

                if (!response.ok || !data?.success) {
                    throw new Error(data?.message || 'Failed to load this transfer');
                }

                if (isCurrent) setTransfer(data.transfer);
            } catch (err) {
                console.error('Error loading transfer details:', err);

                // A dead session already redirects to login inside fetchWithAuth
                if (isCurrent && err.message !== 'Session expired') {
                    setError(err.message || 'Failed to load this transfer');
                }
            } finally {
                if (isCurrent) setIsLoading(false);
            }
        };

        load();

        return () => { isCurrent = false; };
    }, [id]);

    // Lets an action swap in the updated record the server returned, without refetching
    return { transfer, isLoading, isNotFound, error, updateTransfer: setTransfer };
};