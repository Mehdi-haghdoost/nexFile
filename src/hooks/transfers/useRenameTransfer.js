"use client";

import { useCallback, useState } from 'react';
import { api } from '@/lib/fetchWithAuth';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { TRANSFER_MAX_NAME_LENGTH } from '@/utils/constants/transferConstants';

// Shown when the reason is nothing the user can fix, such as a lost connection or a server fault
const RENAME_FAILED_MESSAGE = "Couldn't rename the transfer. Please try again.";

// Renames a transfer and hands the updated record back to the caller
export const useRenameTransfer = ({ onUpdated } = {}) => {
    const [isRenaming, setIsRenaming] = useState(false);

    // Resolves to true once the transfer has the new name, so the editor knows it can close
    const renameTransfer = useCallback(async (transfer, nextName) => {
        if (isRenaming || !transfer?.id) return false;

        const name = typeof nextName === 'string' ? nextName.trim() : '';

        // Checked here too, so an invalid name never makes a request
        if (!name) {
            showErrorToast('Enter a transfer name');
            return false;
        }

        if (name.length > TRANSFER_MAX_NAME_LENGTH) {
            showErrorToast(`Transfer name cannot exceed ${TRANSFER_MAX_NAME_LENGTH} characters`);
            return false;
        }

        // Nothing to save when the name is unchanged
        if (name === transfer.groupName) return true;

        setIsRenaming(true);

        // Only a message the server wrote for a rejected request is worth showing as it is
        let serverMessage = null;

        try {
            const response = await api.post(`/api/transfers/${transfer.id}/rename`, { groupName: name });

            // A server error page is not JSON, so it falls through to the general message
            const data = await response.json().catch(() => null);

            if (!response.ok || !data?.success) {
                // A 4xx explains what to change, such as a name that is too long; a 5xx does not
                const isRejected = response.status >= 400 && response.status < 500;
                serverMessage = isRejected && typeof data?.message === 'string' ? data.message : null;
                throw new Error(serverMessage || RENAME_FAILED_MESSAGE);
            }

            onUpdated?.(data.transfer);
            showSuccessToast('Transfer renamed');

            return true;
        } catch (error) {
            console.error('Error renaming transfer:', error);

            // A dead session already redirects to login inside fetchWithAuth
            if (error.message !== 'Session expired') {
                showErrorToast(serverMessage || RENAME_FAILED_MESSAGE);
            }
            return false;
        } finally {
            setIsRenaming(false);
        }
    }, [isRenaming, onUpdated]);

    return { renameTransfer, isRenaming };
};