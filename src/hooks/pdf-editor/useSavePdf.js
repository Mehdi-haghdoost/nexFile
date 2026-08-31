'use client';
import { useState } from 'react';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import usePdfPagesStore from '@/store/features/pdf-editor/pdfPagesStore';
import usePdfAnnotationsStore from '@/store/features/pdf-editor/pdfAnnotationsStore';
import useFilesStore from '@/store/features/files/filesStore';
import { buildExportedPdf } from '@/utils/pdf-editor/exportPdf';
import { api } from '@/lib/fetchWithAuth';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export const useSavePdf = () => {
    const [isSaving, setIsSaving] = useState(false);

    const { fileId, fileName } = usePdfEditorStore();
    const { pages } = usePdfPagesStore();
    const { annotationsByPage, signatureBoxesByPage } = usePdfAnnotationsStore();
    const { addFile } = useFilesStore();

    const saveAsCopy = async () => {
        setIsSaving(true);

        try {
            // Re-fetches the original bytes through the same proxy the viewer
            // uses, so export always starts from an unmodified source file.
            const response = await api.get(`/api/files/${fileId}/content`);
            if (!response.ok) throw new Error('Failed to read the original file');

            const originalArrayBuffer = await response.arrayBuffer();

            const exportedBytes = await buildExportedPdf({
                originalArrayBuffer,
                pages,
                annotationsByPage,
                signatureBoxesByPage,
            });

            const baseName = fileName.replace(/\.pdf$/i, '');
            const outputName = `${baseName} (edited).pdf`;

            const formData = new FormData();
            formData.append('file', new Blob([exportedBytes], { type: 'application/pdf' }), outputName);

            const uploadResponse = await api.upload('/api/files/upload', formData);
            const data = await uploadResponse.json();

            if (!uploadResponse.ok || !data.success) {
                throw new Error(data.message || 'Failed to save the file');
            }

            addFile(data.file);
            showSuccessToast(`Saved as "${outputName}"`);
            return { success: true, file: data.file };
        } catch (error) {
            showErrorToast(error.message || 'Failed to save the file');
            return { success: false, error: error.message };
        } finally {
            setIsSaving(false);
        }
    };

    return { saveAsCopy, isSaving };
};