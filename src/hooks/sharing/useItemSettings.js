'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/fetchWithAuth';

// Turns a refused or broken response into an error carrying the server's message and status
const readResult = async (response, fallback) => {
    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success) {
        const error = new Error(data?.message || fallback);
        error.status = response.status;
        throw error;
    }

    return data;
};

// The stored Manage access settings of one file or folder, loaded fresh each time it opens
export const useItemSettings = (itemId, itemType) => {
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Newest request, so a slower older answer never replaces newer settings
    const latestRequest = useRef(0);

    const settingsUrl = itemId ? `/api/files/${itemId}/permissions` : null;

    const load = useCallback(async () => {
        if (!settingsUrl) return;

        const requestId = ++latestRequest.current;
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get(`${settingsUrl}?itemType=${encodeURIComponent(itemType)}`);
            const data = await readResult(response, 'Failed to load the settings');

            if (requestId === latestRequest.current) setSettings(data.permissions);
        } catch (err) {
            // A dead session already redirects to login inside fetchWithAuth
            if (requestId === latestRequest.current && err.message !== 'Session expired') {
                setError({ message: err.message, status: err.status || null });
            }
        } finally {
            if (requestId === latestRequest.current) setIsLoading(false);
        }
    }, [settingsUrl, itemType]);

    useEffect(() => {
        setSettings(null);
        setError(null);
        load();
    }, [load]);

    // Saves only the fields given and keeps what the server stored
    const save = useCallback(async (changes) => {
        const response = await api.patch(settingsUrl, { itemType, ...changes });
        const data = await readResult(response, 'Failed to save the settings');

        latestRequest.current += 1;
        setIsLoading(false);
        setSettings(data.item.permissions);

        return data.item.permissions;
    }, [settingsUrl, itemType]);

    return { settings, isLoading, error, reload: load, save };
};