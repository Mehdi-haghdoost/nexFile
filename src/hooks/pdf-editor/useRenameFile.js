'use client';
import { useState } from 'react';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import useFilesStore from '@/store/features/files/filesStore';
import { api } from '@/lib/fetchWithAuth';
import { showErrorToast } from '@/lib/toast';

export const useRenameFile = () => {
    const [isRenaming, setIsRenaming] = useState(false);
    const { fileId, fileName, setFileName } = usePdfEditorStore();
    const { updateFile } = useFilesStore();

    const renameFile = async (nextName) => {
        const trimmed = nextName.trim();
        if (!trimmed || trimmed === fileName) return { success: false };

        // Keeps the extension so the file stays a .pdf by name
        const finalName = /\.pdf$/i.test(trimmed) ? trimmed : `${trimmed}.pdf`;
        const previousName = fileName;

        // Applied immediately so the header doesn't lag behind the request
        setFileName(finalName);
        setIsRenaming(true);

        try {
            const response = await api.patch(`/api/files/${fileId}`, { originalName: finalName });
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to rename the file');
            }

            // Keeps the files list in sync without refetching it
            updateFile(fileId, { name: data.file.name, originalName: data.file.originalName });

            return { success: true, file: data.file };
        } catch (error) {
            setFileName(previousName);
            showErrorToast(error.message || 'Failed to rename the file');
            return { success: false, error: error.message };
        } finally {
            setIsRenaming(false);
        }
    };

    return { renameFile, isRenaming };
};