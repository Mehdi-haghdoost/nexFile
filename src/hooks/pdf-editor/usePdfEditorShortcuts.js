'use client';
import { useEffect } from 'react';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import usePdfAnnotationsStore from '@/store/features/pdf-editor/pdfAnnotationsStore';
import usePdfPagesStore from '@/store/features/pdf-editor/pdfPagesStore';

// True while focus is in a text box or form field, where the browser's own
// editing shortcuts should win over the editor's
const isTypingTarget = (target) =>
    target?.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName);

export const usePdfEditorShortcuts = () => {
    const { setActiveEditingTool, zoomIn, zoomOut, setZoomLevel, enableFitToWidth } = usePdfEditorStore();
    const { undo, redo } = usePdfAnnotationsStore();
    const { setCurrentPage } = usePdfPagesStore();

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isTypingTarget(event.target)) return;

            const isMod = event.ctrlKey || event.metaKey;

            if (isMod) {
                const key = event.key.toLowerCase();

                if (key === 'z' && !event.shiftKey) {
                    event.preventDefault();
                    undo();
                    return;
                }
                if (key === 'y' || (key === 'z' && event.shiftKey)) {
                    event.preventDefault();
                    redo();
                    return;
                }
                if (key === '=' || key === '+') {
                    event.preventDefault();
                    zoomIn();
                    return;
                }
                if (key === '-') {
                    event.preventDefault();
                    zoomOut();
                    return;
                }
                if (key === '0') {
                    event.preventDefault();
                    setZoomLevel(100);
                    return;
                }
                if (key === '9') {
                    event.preventDefault();
                    enableFitToWidth();
                }
                return;
            }

            switch (event.key) {
                case 'Escape':
                    setActiveEditingTool(null);
                    break;
                case 'PageDown':
                    event.preventDefault();
                    setCurrentPage(usePdfPagesStore.getState().currentPage + 1);
                    break;
                case 'PageUp':
                    event.preventDefault();
                    setCurrentPage(usePdfPagesStore.getState().currentPage - 1);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setActiveEditingTool, zoomIn, zoomOut, setZoomLevel, enableFitToWidth, undo, redo, setCurrentPage]);
};