"use client";

import { useCallback, useEffect, useState } from 'react';

// Drives the public download page
// The GET returns metadata with file URLs withheld when a password is set,
// and the POST exchanges the password for the real URLs
export const usePublicTransfer = (token) => {
    const [transfer, setTransfer] = useState(null);
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) return;

        let isCurrent = true;

        const load = async () => {
            setIsLoading(true);

            try {
                const response = await fetch(`/api/public/transfer/${token}`);
                const data = await response.json();

                if (!response.ok || !data?.success) {
                    throw new Error(data?.message || 'This transfer is not available');
                }

                if (!isCurrent) return;

                setTransfer(data.transfer);
                setFiles(data.transfer.files || []);
                setIsUnlocked(!data.transfer.isPasswordEnabled);
            } catch (err) {
                if (isCurrent) setError(err.message);
            } finally {
                if (isCurrent) setIsLoading(false);
            }
        };

        load();

        return () => { isCurrent = false; };
    }, [token]);

    // Also counts the download, so it runs for unprotected transfers too
    const unlock = useCallback(async (password) => {
        if (isUnlocking) return false;

        setIsUnlocking(true);
        setError(null);

        try {
            const response = await fetch(`/api/public/transfer/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Could not unlock this transfer');
            }

            setFiles(data.files || []);
            setIsUnlocked(true);

            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setIsUnlocking(false);
        }
    }, [isUnlocking, token]);

    return { transfer, files, isLoading, isUnlocking, isUnlocked, error, unlock };
};