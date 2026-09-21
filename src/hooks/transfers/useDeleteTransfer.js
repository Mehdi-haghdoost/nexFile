"use client";

import { useCallback, useState } from 'react';
import { api } from '@/lib/fetchWithAuth';
import { showConfirmDialog } from '@/lib/sweetAlert';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

// Confirms and deletes a transfer, shared by the list and the details page
export const useDeleteTransfer = ({ onDeleted } = {}) => {
    const [deletingId, setDeletingId] = useState(null);

    const deleteTransfer = useCallback(async (transfer) => {
        // Guard against a second delete while a request is already running
        if (deletingId || !transfer?.id) return false;

        const confirmed = await showConfirmDialog({
            title: 'Delete this transfer?',
            text: `"${transfer.groupName}" will stop being available at its share link.`,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Keep it',
        });

        if (!confirmed) return false;

        setDeletingId(transfer.id);

        try {
            const response = await api.delete(`/api/transfers/${transfer.id}`);
            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Failed to delete transfer');
            }

            showSuccessToast('Transfer deleted');
            onDeleted?.(transfer);

            return true;
        } catch (error) {
            console.error('Error deleting transfer:', error);

            // A dead session already redirects to login inside fetchWithAuth
            if (error.message !== 'Session expired') {
                showErrorToast(error.message || 'Failed to delete transfer');
            }
            return false;
        } finally {
            setDeletingId(null);
        }
    }, [deletingId, onDeleted]);

    return { deleteTransfer, deletingId };
};