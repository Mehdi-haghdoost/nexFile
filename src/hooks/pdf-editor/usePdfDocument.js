'use client';
import { useEffect } from 'react';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import { loadPdfDocument } from '@/lib/pdfjs';
import { api } from '@/lib/fetchWithAuth';

export const usePdfDocument = (fileId) => {
    const {
        pdfDoc,
        fileName,
        isDocumentLoading,
        documentError,
        startDocumentLoad,
        setDocument,
        failDocumentLoad,
        resetPdfEditor,
    } = usePdfEditorStore();

    useEffect(() => {
        if (!fileId) return;

        let cancelled = false;
        let loadedDoc = null;

        const load = async () => {
            startDocumentLoad(fileId);

            try {
                const response = await api.get(`/api/files/${fileId}/content`);

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(data.message || 'Failed to load the document');
                }

                const encodedName = response.headers.get('X-File-Name');
                const buffer = await response.arrayBuffer();

                if (cancelled) return;

                loadedDoc = await loadPdfDocument(buffer);

                // The request may have been abandoned while pdf.js was parsing
                if (cancelled) {
                    loadedDoc.destroy();
                    return;
                }

                setDocument({
                    pdfDoc: loadedDoc,
                    fileName: encodedName ? decodeURIComponent(encodedName) : 'Document.pdf',
                    totalPages: loadedDoc.numPages,
                });
            } catch (error) {
                if (!cancelled) {
                    failDocumentLoad(error.message || 'Failed to load the document');
                }
            }
        };

        load();

        return () => {
            cancelled = true;
            // Releases the worker's copy of the document
            loadedDoc?.destroy();
            resetPdfEditor();
        };
    }, [fileId, startDocumentLoad, setDocument, failDocumentLoad, resetPdfEditor]);

    return { pdfDoc, fileName, isLoading: isDocumentLoading, error: documentError };
};