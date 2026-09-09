'use client';
import React from 'react';
import usePdfPagesStore from '@/store/features/pdf-editor/pdfPagesStore';
import { PAGE_ACTIONS } from '@/utils/constants/pdfEditorToolsConfig';
import { showErrorToast } from '@/lib/toast';
import { showConfirmDialog } from '@/lib/sweetAlert';

const MobilePageTab = ({ onClose }) => {
    const { pages, currentPage, setCurrentPage, rotatePage, addBlankPageAfter, deletePage } = usePdfPagesStore();
    const currentEntry = pages[currentPage - 1];

    const handleDeletePage = async () => {
        if (!currentEntry) return;

        const confirmed = await showConfirmDialog({
            title: 'Delete this page?',
            text: 'Any drawings, text, or signatures on this page will be removed too. This cannot be undone.',
            confirmButtonText: 'Yes, delete it',
        });

        if (!confirmed) return;

        const result = deletePage(currentEntry.id);
        if (!result.success) showErrorToast('A document needs at least one page');
    };

    const actionHandlers = {
        'rotate-right': () => currentEntry && rotatePage(currentEntry.id, 'cw'),
        'rotate-left': () => currentEntry && rotatePage(currentEntry.id, 'ccw'),
        'add-page': () => addBlankPageAfter(currentEntry?.id ?? null),
        'delete-page': handleDeletePage,
    };

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-800'>
                <span className='text-sm text-neutral-500 dark:text-white'>Current Page:</span>
                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        className='p-2 rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 disabled:opacity-50'
                        disabled={currentPage === 1}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <span className='text-lg font-semibold text-neutral-500 dark:text-white min-w-[60px] text-center'>
                        {currentPage} / {pages.length}
                    </span>
                    <button
                        onClick={() => currentPage < pages.length && setCurrentPage(currentPage + 1)}
                        className='p-2 rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 disabled:opacity-50'
                        disabled={currentPage === pages.length}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
                {PAGE_ACTIONS.map((action) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={action.id}
                            onClick={async () => {
                                await actionHandlers[action.id]();
                                onClose();
                            }}
                            className='flex flex-col items-center gap-2 p-4 rounded-xl border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300 transition-all'
                        >
                            <Icon className="w-8 h-8 text-neutral-500 dark:text-white" />
                            <span className='text-sm font-medium text-neutral-500 dark:text-white text-center'>
                                {action.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobilePageTab;