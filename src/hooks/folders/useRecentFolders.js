"use client";

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/fetchWithAuth';
import useFoldersStore from '@/store/features/folders/foldersStore';

// Lists the folders touched most recently, for the sidebar panel
export const useRecentFolders = () => {
    const [folders, setFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Creating or deleting a folder changes this list, and both clear the cache
    const foldersByParent = useFoldersStore((state) => state.foldersByParent);

    const load = useCallback(async () => {
        try {
            const response = await api.get('/api/folders/recent');
            const data = await response.json();

            if (response.ok && data?.success) setFolders(data.folders || []);
        } catch (error) {
            console.error('Error loading recent folders:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load, foldersByParent]);

    return { folders, isLoading, refresh: load };
};