'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/fetchWithAuth';

// Turns a refused or broken response into an error carrying the server's message
const readResult = async (response, fallback) => {
    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success) {
        throw new Error(data?.message || fallback);
    }

    return data;
};

// Who has access to one file or folder, and the changes the caller may make to it
export const useItemAccess = (itemId, itemType) => {
    const [access, setAccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Newest list request, so a slower older answer never replaces a newer list
    const latestRequest = useRef(0);

    const shareUrl = itemId ? `/api/files/${itemId}/share` : null;

    const load = useCallback(async () => {
        if (!shareUrl) return;

        const requestId = ++latestRequest.current;
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get(`${shareUrl}?itemType=${encodeURIComponent(itemType)}`);
            const data = await readResult(response, 'Failed to load who has access');

            if (requestId === latestRequest.current) setAccess(data);
        } catch (err) {
            // A dead session already redirects to login inside fetchWithAuth
            if (requestId === latestRequest.current && err.message !== 'Session expired') {
                setError(err.message);
            }
        } finally {
            if (requestId === latestRequest.current) setIsLoading(false);
        }
    }, [shareUrl, itemType]);

    useEffect(() => {
        setAccess(null);
        load();
    }, [load]);

    // Every change answers with the fresh list, which replaces whatever was loading
    const applyList = useCallback((data) => {
        latestRequest.current += 1;
        setIsLoading(false);
        setAccess(data);
        return data;
    }, []);

    const addPeople = useCallback(async (users, note) => {
        const response = await api.post(shareUrl, { itemType, users, note });
        return applyList(await readResult(response, 'Failed to share'));
    }, [shareUrl, itemType, applyList]);

    const changeRole = useCallback(async (userId, permission) => {
        const response = await api.patch(shareUrl, { itemType, userId, permission });
        return applyList(await readResult(response, 'Failed to change access'));
    }, [shareUrl, itemType, applyList]);

    const removePerson = useCallback(async (userId) => {
        const response = await api.delete(shareUrl, { body: JSON.stringify({ itemType, userId }) });
        return applyList(await readResult(response, 'Failed to remove access'));
    }, [shareUrl, itemType, applyList]);

    return { access, isLoading, error, reload: load, addPeople, changeRole, removePerson };
};