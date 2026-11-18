"use client";

import { useCallback, useState } from 'react';
import { api } from '@/lib/fetchWithAuth';
import { showConfirmDialog } from '@/lib/sweetAlert';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import {
    getRejectionMessage,
    getToastMessage,
    isSessionExpired,
    readJson,
    TransferRequestError,
} from '@/utils/transfers/transferRequestErrors';

// Shown when the reason is nothing the user can fix, such as a lost connection or a server fault
const DELETE_FAILED_MESSAGE = "Couldn't delete the transfer. Please try again.";

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
            const data = await readJson(response);

            if (!response.ok || !data?.success) {
                throw new TransferRequestError(getRejectionMessage(response, data));
            }

            showSuccessToast('Transfer deleted');
            onDeleted?.(transfer);

            return true;
        } catch (error) {
            console.error('Error deleting transfer:', error);

            if (!isSessionExpired(error)) {
                showErrorToast(getToastMessage(error, DELETE_FAILED_MESSAGE));
            }
            return false;
        } finally {
            setDeletingId(null);
        }
    }, [deletingId, onDeleted]);

    return { deleteTransfer, deletingId };
};