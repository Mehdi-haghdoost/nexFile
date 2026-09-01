'use client';
import React, { useState, useEffect } from 'react';
import PdfEditorHeader from '@/components/templates/pdf-editor/PdfEditorHeader';
import PdfEditorToolbar from '@/components/templates/pdf-editor/PdfEditorToolbar';
import PdfEditorSidebar from '@/components/templates/pdf-editor/PdfEditorSidebar';
import PdfEditorMainArea from '@/components/templates/pdf-editor/PdfEditorMainArea';
import MobileToolsPanel from '@/components/templates/pdf-editor/MobileToolsPanel';
import { usePdfDocument } from '@/hooks/pdf-editor/usePdfDocument';
import { useHasUnsavedChanges } from '@/hooks/pdf-editor/useHasUnsavedChanges';

const PdfEditorLayout = ({ fileId }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);

    const { isLoading, error } = usePdfDocument(fileId);
    const hasUnsavedChanges = useHasUnsavedChanges();

    // Native browser prompt on tab close or refresh while there are unsaved edits
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (!hasUnsavedChanges) return;
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    return (
        <div className='flex justify-center items-center w-screen h-screen bg-gray-50 dark:bg-neutral-800 overflow-hidden'>
            <div className='flex flex-col w-full h-full'>
                <PdfEditorHeader />

                <div className='hidden lg:block'>
                    <PdfEditorToolbar />
                </div>

                <div className='flex flex-1 min-w-0 overflow-hidden relative'>
                    {isSidebarOpen && (
                        <div
                            className='fixed inset-0 bg-black/50 z-40 lg:hidden'
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}

                    <div className={`
                        fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
                        transform transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    `}>
                        <PdfEditorSidebar onClose={() => setIsSidebarOpen(false)} />
                    </div>

                    {isLoading && (
                        <div className='flex flex-1 flex-col items-center justify-center gap-3 bg-stroke-200 dark:bg-neutral-700'>
                            <div className='w-6 h-6 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin' />
                            <p className='text-sm text-neutral-300 dark:text-neutral-200'>Loading document...</p>
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className='flex flex-1 flex-col items-center justify-center gap-2 bg-stroke-200 dark:bg-neutral-700 px-6'>
                            <p className='text-sm font-medium text-error-400 text-center'>{error}</p>
                            <p className='text-xs text-neutral-300 dark:text-neutral-200 text-center'>
                                The file may have been moved, deleted, or is not a PDF.
                            </p>
                        </div>
                    )}

                    {!isLoading && !error && <PdfEditorMainArea />}

                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className='lg:hidden fixed bottom-24 left-4 z-30 w-14 h-14 rounded-full bg-white dark:bg-neutral-800 shadow-lg border border-stroke-300 dark:border-neutral-600 flex items-center justify-center hover:scale-110 active:scale-95 transition-[border,box-shadow,transform,color,opacity]'
                        aria-label="Toggle pages"
                    >
                        <svg className="w-6 h-6 text-neutral-500 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </button>

                    <button
                        onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
                        className='lg:hidden fixed bottom-4 right-7 z-30 w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-[border,box-shadow,transform,color,opacity]'
                        aria-label="Toggle tools"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                        </svg>
                    </button>

                    <MobileToolsPanel
                        isOpen={isMobileToolsOpen}
                        onClose={() => setIsMobileToolsOpen(false)}
                    />
                </div>
            </div>
        </div>
    );
};

export default PdfEditorLayout;