"use client";

import { useCallback, useState } from 'react';
import { api } from '@/lib/fetchWithAuth';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

// Builds the toast for a retry, naming the address when only one was involved
const describeOutcome = (sent, failed) => {
    if (!failed.length) {
        return {
            ok: true,
            text: sent.length === 1 ? `Email sent to ${sent[0]}` : `Emails sent to ${sent.length} people`,
        };
    }

    if (!sent.length) {
        return {
            ok: false,
            text: failed.length === 1 ? `Still could not reach ${failed[0]}` : `Still could not reach ${failed.length} people`,
        };
    }

    return { ok: false, text: `Sent to ${sent.length}, still could not reach ${failed.length}` };
};

// Retries failed transfer emails and hands the updated record back to the caller
export const useResendTransferEmails = ({ onUpdated } = {}) => {
    const [retryingTarget, setRetryingTarget] = useState(null);

    const retryDelivery = useCallback(async (transfer, email = null) => {
        // Guard against a second retry while one is already running
        if (retryingTarget || !transfer?.id) return false;

        setRetryingTarget(email || 'all');

        try {
            const response = await api.post(
                `/api/transfers/${transfer.id}/resend`,
                email ? { email } : {}
            );
            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Failed to resend the email');
            }

            onUpdated?.(data.transfer);

            const { sent = [], failed = [] } = data.delivery || {};
            const outcome = describeOutcome(sent, failed);

            if (outcome.ok) {
                showSuccessToast(outcome.text);
            } else {
                showErrorToast(outcome.text);
            }

            return outcome.ok;
        } catch (error) {
            console.error('Error resending transfer email:', error);

            // A dead session already redirects to login inside fetchWithAuth
            if (error.message !== 'Session expired') {
                showErrorToast(error.message || 'Failed to resend the email');
            }
            return false;
        } finally {
            setRetryingTarget(null);
        }
    }, [retryingTarget, onUpdated]);

    return { retryDelivery, retryingTarget };
};