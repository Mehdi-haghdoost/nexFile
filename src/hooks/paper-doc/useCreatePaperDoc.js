"use client";

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

// Shared creation flow for paper documents
// The header button and the sidebar button both call createDoc so the request,
// the toast feedback and the redirect stay identical in both places
export const useCreatePaperDoc = ({ onCreated } = {}) => {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);

    const createDoc = useCallback(async (folder) => {
        // Guard against double submits while a request is already running
        if (isCreating) return null;

        if (!folder?.id) {
            showErrorToast('Select a folder before creating a document');
            return null;
        }

        setIsCreating(true);

        try {
            const response = await fetch('/api/files/paper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: 'Untitled Document',
                    folderId: folder.id,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Failed to create document');
            }

            showSuccessToast(`New document created in ${folder.name}`);
            onCreated?.(data.file, folder);
            router.push(`/paper-doc/${data.file.id}`);

            return data.file;
        } catch (error) {
            console.error('Error creating paper doc:', error);
            showErrorToast(error.message || 'Failed to create document');
            return null;
        } finally {
            setIsCreating(false);
        }
    }, [isCreating, onCreated, router]);

    return { createDoc, isCreating };
};