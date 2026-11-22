'use client';
import { useEffect } from 'react';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import usePdfAnnotationsStore from '@/store/features/pdf-editor/pdfAnnotationsStore';
import usePdfPagesStore from '@/store/features/pdf-editor/pdfPagesStore';
import { loadPdfDocument } from '@/lib/pdfjs';
import { api } from '@/lib/fetchWithAuth';

export const usePdfDocument = (fileId) => {
    const {
        pdfDoc,
        fileName,
        isDocumentLoading,
        documentError,
        documentReloadKey,
        startDocumentLoad,
        setDocument,
        failDocumentLoad,
        resetPdfEditor,
    } = usePdfEditorStore();

    const { resetAnnotations } = usePdfAnnotationsStore();
    const { initializePages, resetPages } = usePdfPagesStore();

    // Loads again for a new file id, or for the same file when a reload is requested
    useEffect(() => {
        if (!fileId) return;

        let cancelled = false;
        let loadedDoc = null;

        const load = async () => {
            startDocumentLoad(fileId);
            resetAnnotations();
            resetPages();

            try {
                const response = await api.get(`/api/files/${fileId}/content`);

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(data.message || 'Failed to load the document');
                }

                const encodedName = response.headers.get('X-File-Name');
                const accessRole = response.headers.get('X-Access-Role');
                const versionHeader = Number(response.headers.get('X-File-Version'));
                const buffer = await response.arrayBuffer();

                if (cancelled) return;

                loadedDoc = await loadPdfDocument(buffer);

                if (cancelled) {
                    loadedDoc?.destroy?.();
                    return;
                }

                setDocument({
                    pdfDoc: loadedDoc,
                    fileName: encodedName ? decodeURIComponent(encodedName) : 'Document.pdf',
                    accessRole,
                    fileVersion: Number.isInteger(versionHeader) && versionHeader > 0 ? versionHeader : null,
                });
                initializePages(loadedDoc.numPages);
            } catch (error) {
                if (!cancelled) {
                    failDocumentLoad(error.message || 'Failed to load the document');
                }
            }
        };

        load();

        return () => {
            cancelled = true;
            loadedDoc?.destroy?.();
            resetPdfEditor();
            resetAnnotations();
            resetPages();
        };
    }, [fileId, documentReloadKey, startDocumentLoad, setDocument, failDocumentLoad, resetPdfEditor, resetAnnotations, initializePages, resetPages]);

    return { pdfDoc, fileName, isLoading: isDocumentLoading, error: documentError };
};