"use client";

import { useCallback, useEffect, useState } from 'react';

// Plain fetch on purpose: recipients have no session to refresh
export const usePublicTransfer = (token) => {
    const [transfer, setTransfer] = useState(null);
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isLockedOut, setIsLockedOut] = useState(false);
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
                setIsUnlocked(Boolean(data.transfer.isUnlocked));
            } catch (err) {
                if (isCurrent) setError(err.message);
            } finally {
                if (isCurrent) setIsLoading(false);
            }
        };

        load();

        return () => { isCurrent = false; };
    }, [token]);

    // Exchanges the password for download links and a scoped access cookie
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

            // 429 means the client is locked out, so the form is disabled rather than retried
            if (response.status === 429) {
                setIsLockedOut(true);
                throw new Error(data?.message || 'Too many attempts');
            }

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

    return { transfer, files, isLoading, isUnlocking, isUnlocked, isLockedOut, error, unlock };
};