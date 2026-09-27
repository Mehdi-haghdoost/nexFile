"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/fetchWithAuth';

// Read state lives in the browser rather than on the user, since a missed
// notice is a small loss and this avoids a write path for something derived
const SEEN_KEY = 'nexfile:transferNoticesSeenAt';

const readSeenAt = () => {
    if (typeof window === 'undefined') return 0;

    try {
        return Number(window.localStorage.getItem(SEEN_KEY)) || 0;
    } catch {
        return 0;
    }
};

export const useTransferNotices = () => {
    const [notices, setNotices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [seenAt, setSeenAt] = useState(0);

    useEffect(() => {
        setSeenAt(readSeenAt());
    }, []);

    const load = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await api.get('/api/transfers/notices');
            const data = await response.json();

            if (response.ok && data?.success) setNotices(data.notices || []);
        } catch (error) {
            console.error('Error loading transfer notices:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const unreadCount = useMemo(
        () => notices.filter((notice) => new Date(notice.at).getTime() > seenAt).length,
        [notices, seenAt]
    );

    // Called when the panel opens, so the dot clears as soon as they are read
    const markAllSeen = useCallback(() => {
        const now = Date.now();
        setSeenAt(now);

        try {
            window.localStorage.setItem(SEEN_KEY, String(now));
        } catch {
            // A blocked storage API only costs the read state, not the feed
        }
    }, []);

    return { notices, isLoading, unreadCount, seenAt, markAllSeen, refresh: load };
};