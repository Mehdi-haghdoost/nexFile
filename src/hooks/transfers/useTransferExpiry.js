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
const FAILED_MESSAGES = {
    extend: "Couldn't extend the transfer. Please try again.",
    end: "Couldn't end the transfer. Please try again.",
};

// Extends or ends a transfer and hands the updated record back to the caller
export const useTransferExpiry = ({ onUpdated } = {}) => {
    const [pendingAction, setPendingAction] = useState(null);

    // Shared request flow for both actions
    const runAction = useCallback(async (action, url, body, successMessage) => {
        setPendingAction(action);

        try {
            const response = await api.post(url, body);
            const data = await readJson(response);

            if (!response.ok || !data?.success) {
                throw new TransferRequestError(getRejectionMessage(response, data));
            }

            onUpdated?.(data.transfer);
            showSuccessToast(successMessage);

            return true;
        } catch (error) {
            console.error(`Error running ${action} on transfer:`, error);

            if (!isSessionExpired(error)) {
                showErrorToast(getToastMessage(error, FAILED_MESSAGES[action]));
            }
            return false;
        } finally {
            setPendingAction(null);
        }
    }, [onUpdated]);

    const extendTransfer = useCallback(async (transfer, days) => {
        if (pendingAction || !transfer?.id) return false;

        const wasExpired = transfer.status === 'expired';

        return runAction(
            'extend',
            `/api/transfers/${transfer.id}/extend`,
            { expiresInDays: days },
            wasExpired ? 'Transfer reactivated' : 'Expiry extended'
        );
    }, [pendingAction, runAction]);

    const endTransfer = useCallback(async (transfer) => {
        if (pendingAction || !transfer?.id) return false;

        const confirmed = await showConfirmDialog({
            title: 'End this transfer now?',
            text: 'Recipients lose access immediately. You can reactivate it later by setting a new expiry.',
            confirmButtonText: 'End transfer',
            cancelButtonText: 'Keep it active',
        });

        if (!confirmed) return false;

        return runAction('end', `/api/transfers/${transfer.id}/end`, {}, 'Transfer ended');
    }, [pendingAction, runAction]);

    return { extendTransfer, endTransfer, pendingAction };
};