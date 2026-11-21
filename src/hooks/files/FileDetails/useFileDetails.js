'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/fetchWithAuth';

// Loads one file's details and the caller's role, for the in-app file page
export const useFileDetails = (fileId) => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(Boolean(fileId));
    const [isNotFound, setIsNotFound] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!fileId) return undefined;

        // A response for an earlier file id is dropped
        let cancelled = false;

        const load = async () => {
            setIsLoading(true);
            setIsNotFound(false);
            setError(null);

            try {
                const response = await api.get(`/api/files/${fileId}`);
                const data = await response.json().catch(() => null);

                if (cancelled) return;

                // The server answers 404 both for a missing file and for one the caller cannot open
                if (response.status === 404) {
                    setFile(null);
                    setIsNotFound(true);
                    return;
                }

                if (!response.ok || !data?.success) {
                    throw new Error(data?.message || 'Failed to load this file');
                }

                setFile(data.file);
            } catch (err) {
                if (cancelled) return;

                // A dead session already redirects to login inside fetchWithAuth
                if (err.message !== 'Session expired') {
                    setError(err.message || 'Failed to load this file');
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [fileId]);

    return { file, isLoading, isNotFound, error };
};