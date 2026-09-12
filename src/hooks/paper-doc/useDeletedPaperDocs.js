"use client";

import { useCallback, useState } from 'react';
import { showConfirmDialog } from '@/lib/sweetAlert';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

// Loads the soft deleted paper documents and handles restore and permanent removal
export const useDeletedPaperDocs = ({ onRestored } = {}) => {
    const [docs, setDocs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [busyId, setBusyId] = useState(null);

    const loadDeleted = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/files/paper/deleted', {
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Failed to load deleted documents');
            }

            setDocs(data.files || []);
        } catch (error) {
            console.error('Error loading deleted paper docs:', error);
            showErrorToast(error.message || 'Failed to load deleted documents');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const restoreDoc = useCallback(async (doc) => {
        // Guard against a second action while a request is already running
        if (busyId || !doc?.id) return false;

        setBusyId(doc.id);

        try {
            const response = await fetch(`/api/files/paper/${doc.id}`, {
                method: 'PATCH',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Failed to restore document');
            }

            setDocs((prev) => prev.filter((item) => item.id !== doc.id));
            showSuccessToast('Document restored');
            onRestored?.(doc);

            return true;
        } catch (error) {
            console.error('Error restoring paper doc:', error);
            showErrorToast(error.message || 'Failed to restore document');
            return false;
        } finally {
            setBusyId(null);
        }
    }, [busyId, onRestored]);

    const destroyDoc = useCallback(async (doc) => {
        if (busyId || !doc?.id) return false;

        const confirmed = await showConfirmDialog({
            title: 'Delete forever?',
            text: `"${doc.name || 'Untitled'}" will be removed from the database. This cannot be undone.`,
            confirmButtonText: 'Delete forever',
            cancelButtonText: 'Keep it',
            confirmButtonColor: '#C94653',
        });

        if (!confirmed) return false;

        setBusyId(doc.id);

        try {
            const response = await fetch(`/api/files/paper/${doc.id}?permanent=true`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Failed to delete document');
            }

            setDocs((prev) => prev.filter((item) => item.id !== doc.id));
            showSuccessToast('Document permanently deleted');

            return true;
        } catch (error) {
            console.error('Error destroying paper doc:', error);
            showErrorToast(error.message || 'Failed to delete document');
            return false;
        } finally {
            setBusyId(null);
        }
    }, [busyId]);

    return { docs, isLoading, busyId, loadDeleted, restoreDoc, destroyDoc };
};