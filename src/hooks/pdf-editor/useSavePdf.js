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
    const [isExporting, setIsExporting] = useState(false);

    const { fileId, fileName } = usePdfEditorStore();
    const { pages, markPagesSaved } = usePdfPagesStore();
    const { annotationsByPage, textBoxesByPage, signatureBoxesByPage, markAnnotationsSaved } = usePdfAnnotationsStore();
    const { addFile } = useFilesStore();

    // Shared by both save paths: read the original file and bake in the current edits
    const buildCurrentPdfBytes = async () => {
        const response = await api.get(`/api/files/${fileId}/content`);
        if (!response.ok) throw new Error('Failed to read the original file');

        const originalArrayBuffer = await response.arrayBuffer();

        return buildExportedPdf({
            originalArrayBuffer,
            pages,
            annotationsByPage,
            textBoxesByPage,
            signatureBoxesByPage,
        });
    };

    const outputFileName = () => `${fileName.replace(/\.pdf$/i, '')} (edited).pdf`;

    const saveAsCopy = async () => {
        setIsSaving(true);

        try {
            const exportedBytes = await buildCurrentPdfBytes();
            const outputName = outputFileName();

            const formData = new FormData();
            formData.append('file', new Blob([exportedBytes], { type: 'application/pdf' }), outputName);

            const uploadResponse = await api.upload('/api/files/upload', formData);
            const data = await uploadResponse.json();

            if (!uploadResponse.ok || !data.success) {
                throw new Error(data.message || 'Failed to save the file');
            }

            addFile(data.file);
            showSuccessToast(`Saved as "${outputName}"`);

            markAnnotationsSaved();
            markPagesSaved();

            return { success: true, file: data.file };
        } catch (error) {
            showErrorToast(error.message || 'Failed to save the file');
            return { success: false, error: error.message };
        } finally {
            setIsSaving(false);
        }
    };

    // Downloads straight to disk; no upload, so the unsaved-changes flag stays untouched
    const exportToDevice = async () => {
        setIsExporting(true);

        try {
            const exportedBytes = await buildCurrentPdfBytes();
            const outputName = outputFileName();

            const blob = new Blob([exportedBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = outputName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showSuccessToast(`Downloaded "${outputName}"`);
            return { success: true };
        } catch (error) {
            showErrorToast(error.message || 'Failed to export the file');
            return { success: false, error: error.message };
        } finally {
            setIsExporting(false);
        }
    };

    return { saveAsCopy, isSaving, exportToDevice, isExporting };
};