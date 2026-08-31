'use client';
import React, { useState } from 'react';
import { NewTaskIconPdf, FilterListButtonIcon, CloseIcon } from '@/components/ui/icons';
import PageThumbnail from './PageThumbnail';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import usePdfPagesStore from '@/store/features/pdf-editor/pdfPagesStore';

const PdfEditorSidebar = ({ onClose }) => {
    const { pdfDoc } = usePdfEditorStore();
    const { pages, currentPage, setCurrentPage } = usePdfPagesStore();
    const [viewMode, setViewMode] = useState('thumbnails');

    const handlePageSelect = (index) => {
        setCurrentPage(index);
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            onClose?.();
        }
    };

    const renderPages = () => {
        if (pages.length === 0) {
            return <p className='text-regular-12-neutral-300 text-center'>No document loaded</p>;
        }

        if (viewMode === 'list') {
            return (
                <ul className='flex flex-col items-stretch gap-1 w-full'>
                    {pages.map((entry, index) => (
                        <li key={entry.id}>
                            <button
                                onClick={() => handlePageSelect(index + 1)}
                                className={`flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    currentPage === index + 1
                                        ? 'bg-primary-500/10 dark:bg-dark-overlay text-primary-500'
                                        : 'text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700'
                                }`}
                            >
                                Page {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            );
        }

        return pages.map((entry, index) => (
            <PageThumbnail
                key={entry.id}
                pdfDoc={pdfDoc}
                entry={entry}
                displayIndex={index + 1}
                isSelected={currentPage === index + 1}
                onClick={() => handlePageSelect(index + 1)}
            />
        ));
    };

    return (
        <aside className='flex flex-col justify-between items-start py-6 px-4 gap-6 w-[220px] lg:w-[200px] h-full bg-white dark:bg-neutral-900 border-r border-stroke-200 dark:border-neutral-700 flex-shrink-0'>
            <div className='flex items-center justify-between w-full lg:hidden'>
                <h3 className='text-sm font-semibold text-neutral-500 dark:text-white'>Pages</h3>
                <button
                    onClick={onClose}
                    className='p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded transition-[border,box-shadow,transform,color,opacity]'
                    aria-label="Close sidebar"
                >
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>

            <div className='flex flex-1 flex-col items-center gap-4 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-600'>
                {renderPages()}
            </div>

            <nav className='flex items-center justify-center gap-1 h-8 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100 dark:bg-neutral-900 dark:border-neutral-700 w-full flex-shrink-0'>
                <button
                    onClick={() => setViewMode('thumbnails')}
                    className={`flex flex-1 justify-center items-center py-1 px-2 rounded-lg transition-[border,box-shadow,transform,color,opacity] ${
                        viewMode === 'thumbnails'
                            ? 'bg-white border border-stroke-200 shadow-middle dark:bg-dark-gradient dark:border-dark-border'
                            : 'bg-transparent'
                    }`}
                    aria-label="Thumbnail view"
                    title="Thumbnail view"
                >
                    <NewTaskIconPdf className="w-4 h-4" />
                </button>

                <button
                    onClick={() => setViewMode('list')}
                    className={`flex flex-1 items-center justify-center py-1 px-2 rounded-lg transition-[border,box-shadow,transform,color,opacity] ${
                        viewMode === 'list'
                            ? 'bg-white border border-stroke-200 shadow-middle dark:bg-dark-gradient dark:border-dark-border'
                            : 'bg-transparent'
                    }`}
                    aria-label="List view"
                    title="List view"
                >
                    <FilterListButtonIcon className="w-4 h-4" />
                </button>
            </nav>
        </aside>
    );
};

export default PdfEditorSidebar;