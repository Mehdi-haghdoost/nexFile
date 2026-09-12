"use client";

import { useCallback, useState } from 'react';
import { showConfirmDialog } from '@/lib/sweetAlert';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

// Shared delete flow for paper documents
// The header and the sidebar both call deleteDoc so the confirmation,
// the request and the toast feedback stay identical in both places
export const useDeletePaperDoc = ({ onDeleted } = {}) => {
    const [deletingId, setDeletingId] = useState(null);

    const deleteDoc = useCallback(async (file, folder, nextFileId = null) => {
        // Guard against a second delete while a request is already running
        if (deletingId) return false;

        if (!file?.id) {
            showErrorToast('This document cannot be deleted');
            return false;
        }

        const confirmed = await showConfirmDialog({
            title: 'Delete this document?',
            text: `"${file.name || 'Untitled'}" will be moved to deleted files.`,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Keep it',
        });

        if (!confirmed) return false;

        setDeletingId(file.id);

        try {
            const response = await fetch(`/api/files/paper/${file.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Failed to delete document');
            }

            showSuccessToast('Document moved to deleted files');
            onDeleted?.(file, folder, nextFileId);

            return true;
        } catch (error) {
            console.error('Error deleting paper doc:', error);
            showErrorToast(error.message || 'Failed to delete document');
            return false;
        } finally {
            setDeletingId(null);
        }
    }, [deletingId, onDeleted]);

    return { deleteDoc, deletingId };
};