'use client';
import { useEffect } from 'react';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import usePdfAnnotationsStore from '@/store/features/pdf-editor/pdfAnnotationsStore';
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

    const { resetAnnotations } = usePdfAnnotationsStore();

    useEffect(() => {
        if (!fileId) return;

        let cancelled = false;
        let loadedDoc = null;

        const load = async () => {
            startDocumentLoad(fileId);
            // A stale annotation set from a previous file must not leak into
            // the next one if the same page numbers happen to line up.
            resetAnnotations();

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
            loadedDoc?.destroy();
            resetPdfEditor();
            resetAnnotations();
        };
    }, [fileId, startDocumentLoad, setDocument, failDocumentLoad, resetPdfEditor, resetAnnotations]);

    return { pdfDoc, fileName, isLoading: isDocumentLoading, error: documentError };
};