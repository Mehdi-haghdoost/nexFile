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
    const [isReplacing, setIsReplacing] = useState(false);

    const { fileId, fileName, pdfDoc, fileVersion, requestDocumentReload } = usePdfEditorStore();
    const { pages, markPagesSaved } = usePdfPagesStore();
    const { annotationsByPage, textBoxesByPage, signatureBoxesByPage, markAnnotationsSaved } = usePdfAnnotationsStore();
    const { addFile, updateFile } = useFilesStore();

    const bakeInto = (originalArrayBuffer) =>
        buildExportedPdf({
            originalArrayBuffer,
            pages,
            annotationsByPage,
            textBoxesByPage,
            signatureBoxesByPage,
        });

    const outputFileName = () => `${fileName.replace(/\.pdf$/i, '')} (edited).pdf`;

    const saveAsCopy = async () => {
        setIsSaving(true);

        try {
            // Re-reads from storage so the uploaded copy is built from pristine server-side bytes
            const response = await api.get(`/api/files/${fileId}/content`);
            if (!response.ok) throw new Error('Failed to read the original file');

            const exportedBytes = await bakeInto(await response.arrayBuffer());
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

    const exportToDevice = async () => {
        setIsExporting(true);

        try {
            if (!pdfDoc) throw new Error('No document loaded');

            // The loaded document already holds the original bytes, so a local
            // download never needs to touch the network.
            const originalArrayBuffer = await pdfDoc.getData();
            const exportedBytes = await bakeInto(originalArrayBuffer);
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

    // Overwrites the stored PDF for everyone with access; refused if it changed since it was opened
    const replaceOriginal = async () => {
        setIsReplacing(true);

        try {
            if (!pdfDoc) throw new Error('No document loaded');
            if (!fileVersion) throw new Error('Reopen the PDF and try again');

            // Built from the bytes on screen, so every edit lands on the page it was drawn on
            const exportedBytes = await bakeInto(await pdfDoc.getData());

            const formData = new FormData();
            formData.append('file', new Blob([exportedBytes], { type: 'application/pdf' }), fileName || 'Document.pdf');
            formData.append('version', String(fileVersion));

            const response = await api.upload(`/api/files/${fileId}/replace`, formData);
            const data = await response.json().catch(() => null);

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Failed to replace the original PDF');
            }

            markAnnotationsSaved();
            markPagesSaved();

            // Keeps the file list's size and links in step when the file is listed there
            updateFile(fileId, {
                size: data.file.size,
                url: data.file.url,
                secureUrl: data.file.secureUrl,
                updatedAt: data.file.updatedAt,
            });

            showSuccessToast('Original PDF replaced');

            // The saved file now holds the edits, so it is loaded fresh with its new version
            requestDocumentReload();

            return { success: true, file: data.file };
        } catch (error) {
            // A dead session already redirects to login inside fetchWithAuth
            if (error.message !== 'Session expired') {
                showErrorToast(error.message || 'Failed to replace the original PDF');
            }
            return { success: false, error: error.message };
        } finally {
            setIsReplacing(false);
        }
    };

    return { saveAsCopy, isSaving, exportToDevice, isExporting, replaceOriginal, isReplacing };
};