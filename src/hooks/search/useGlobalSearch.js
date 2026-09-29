"use client";

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/fetchWithAuth';

// Long enough to skip the keystrokes of a word being typed out
const SEARCH_DEBOUNCE_MS = 300;

const EMPTY_RESULTS = { folders: [], files: [] };

// Searches the whole account, debounced, for the header's search field
export const useGlobalSearch = (term) => {
    const [results, setResults] = useState(EMPTY_RESULTS);
    const [isSearching, setIsSearching] = useState(false);

    // Lets a slow response be discarded once a newer search has started
    const requestId = useRef(0);

    useEffect(() => {
        const trimmed = term.trim();

        if (trimmed.length < 2) {
            setResults(EMPTY_RESULTS);
            setIsSearching(false);
            return;
        }

        requestId.current += 1;
        const currentRequest = requestId.current;

        setIsSearching(true);

        const timer = setTimeout(async () => {
            try {
                const response = await api.get(`/api/search?q=${encodeURIComponent(trimmed)}`);
                const data = await response.json();

                if (currentRequest !== requestId.current) return;

                if (response.ok && data?.success) {
                    setResults({ folders: data.folders || [], files: data.files || [] });
                }
            } catch (error) {
                console.error('Search error:', error);
                if (currentRequest === requestId.current) setResults(EMPTY_RESULTS);
            } finally {
                if (currentRequest === requestId.current) setIsSearching(false);
            }
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [term]);

    const totalCount = results.folders.length + results.files.length;

    return { results, isSearching, totalCount };
};