"use client";

import { useCallback, useState } from 'react';
import useTransferStore from '@/store/features/transfer/transferStore';
import { showErrorToast } from '@/lib/toast';
import {
    TRANSFER_DEFAULT_EXPIRY_DAYS,
    TRANSFER_MIN_PASSWORD_LENGTH,
} from '@/utils/constants/transferConstants';

export const useCreateTransfer = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [uploadedCount, setUploadedCount] = useState(0);
    const refreshTransfers = useTransferStore((state) => state.refreshTransfers);

    // Uploads one file and returns the metadata the transfer record needs
    const uploadFile = async (entry) => {
        const formData = new FormData();
        formData.append('file', entry.file);

        const response = await fetch('/api/transfers/upload', {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data?.success) {
            throw new Error(data?.message || `Failed to upload ${entry.name}`);
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

        // Checked here as well as on the server so nothing uploads before failing
        if (password && password.length < TRANSFER_MIN_PASSWORD_LENGTH) {
            showErrorToast(`Password must be at least ${TRANSFER_MIN_PASSWORD_LENGTH} characters`);
            return null;
        }

        setIsCreating(true);
        setUploadedCount(0);

        try {
            // Uploaded one at a time so a 100MB limit is not hit in parallel
            const uploaded = [];
            for (const entry of files) {
                const result = await uploadFile(entry);
                uploaded.push(result);
                setUploadedCount(uploaded.length);
            }

            const response = await fetch('/api/transfers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    groupName: groupName || files[0]?.name || 'Untitled Transfer',
                    type,
                    expiresInDays: expiresInDays || TRANSFER_DEFAULT_EXPIRY_DAYS,
                    password: password || null,
                    files: uploaded,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Failed to create transfer');
            }

            refreshTransfers();

            return data.transfer;
        } catch (error) {
            console.error('Error creating transfer:', error);
            showErrorToast(error.message || 'Failed to create transfer');
            return null;
        } finally {
            setIsCreating(false);
            setUploadedCount(0);
        }
    }, [isCreating, refreshTransfers]);

    return { createTransfer, isCreating, uploadedCount };
};