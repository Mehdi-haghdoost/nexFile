"use client";

import { useCallback, useState } from 'react';
import useTransferStore from '@/store/features/transfer/transferStore';
import { api } from '@/lib/fetchWithAuth';
import { showErrorToast } from '@/lib/toast';
import {
    TRANSFER_DEFAULT_EXPIRY_DAYS,
    TRANSFER_MIN_PASSWORD_LENGTH,
} from '@/utils/constants/transferConstants';

export const useCreateTransfer = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [processedCount, setProcessedCount] = useState(0);
    const refreshTransfers = useTransferStore((state) => state.refreshTransfers);

    // Uploads a local file and returns the metadata the transfer record needs
    const uploadFile = async (entry) => {
        const formData = new FormData();
        formData.append('file', entry.file);

        const response = await api.upload('/api/transfers/upload', formData);
        const data = await response.json();

        if (!response.ok || !data?.success) {
            throw new Error(data?.message || `Failed to upload ${entry.name}`);
        }

        return data.file;
    };

    // Copies a stored NexFile file into the transfer folder on the server
    const importFile = async (entry) => {
        const response = await api.post('/api/transfers/import', { fileId: entry.fileId });
        const data = await response.json();

        if (!response.ok || !data?.success) {
            throw new Error(data?.message || `Failed to add ${entry.name}`);
        }

        return data.file;
    };

    const createTransfer = useCallback(async ({
        files,
        type,
        groupName,
        expiresInDays,
        password,
    }) => {
        // Guard against a double submit while a request is already running
        if (isCreating) return null;

        if (!files?.length) {
            showErrorToast('Add at least one file first');
            return null;
        }

        // Checked before any upload so a rejected transfer sends nothing to Cloudinary
        if (password && password.length < TRANSFER_MIN_PASSWORD_LENGTH) {
            showErrorToast(`Password must be at least ${TRANSFER_MIN_PASSWORD_LENGTH} characters`);
            return null;
        }

        setIsCreating(true);
        setProcessedCount(0);

        try {
            // One at a time so large files do not compete for the same connection
            const prepared = [];
            for (const entry of files) {
                const result = entry.source === 'library'
                    ? await importFile(entry)
                    : await uploadFile(entry);

                prepared.push(result);
                setProcessedCount(prepared.length);
            }

            const response = await api.post('/api/transfers', {
                groupName: groupName || files[0]?.name || 'Untitled Transfer',
                type,
                expiresInDays: expiresInDays || TRANSFER_DEFAULT_EXPIRY_DAYS,
                password: password || null,
                files: prepared,
            });

            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Failed to create transfer');
            }

            refreshTransfers();

            return data.transfer;
        } catch (error) {
            console.error('Error creating transfer:', error);

            // A dead session already redirects to login inside fetchWithAuth
            if (error.message !== 'Session expired') {
                showErrorToast(error.message || 'Failed to create transfer');
            }
            return null;
        } finally {
            setIsCreating(false);
            setProcessedCount(0);
        }
    }, [isCreating, refreshTransfers]);

    return { createTransfer, isCreating, processedCount };
};