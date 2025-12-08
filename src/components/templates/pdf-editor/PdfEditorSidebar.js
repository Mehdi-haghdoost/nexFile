'use client';
import React, { useState } from 'react';
import { NewTaskIconPdf, FilterListButtonIcon, CloseIcon } from '@/components/ui/icons';
import PageThumbnail from './PageThumbnail';

const PdfEditorSidebar = ({ onClose }) => {
    const [selectedPage, setSelectedPage] = useState(1);
    const [viewMode, setViewMode] = useState('thumbnails');

    const pages = [
        {
            id: 1,
            number: 1,
            isActive: true,
            hasContent: true
        },
        {
            id: 2,
            number: 2,
            isActive: false,
            hasContent: false
        }
    ];

    const handlePageSelect = (pageNumber) => {
        setSelectedPage(pageNumber);
        console.log(`Selected page: ${pageNumber}`);
        // Auto close on mobile after selection
        if (window.innerWidth < 1024) {
            onClose?.();
        }
    };

    const handleViewModeToggle = () => {
        setViewMode(prev => prev === 'thumbnails' ? 'list' : 'thumbnails');
    };

    return (
        <aside className='flex flex-col justify-between items-start py-6 px-4 gap-6 w-[220px] lg:w-[200px] h-full bg-white dark:bg-neutral-900 border-r border-stroke-200 dark:border-neutral-700 flex-shrink-0'>
            {/* Header with close button */}
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

            {/* Thumbnails */}
            <div className='flex flex-1 flex-col items-center gap-4 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-600'>
                {pages.map((page) => (
                    <PageThumbnail
                        key={page.id}
                        pageNumber={page.number}
                        isSelected={selectedPage === page.number}
                        hasContent={page.hasContent}
                        onClick={() => handlePageSelect(page.number)}
                    />
                ))}
            </div>

            {/* View Mode Toggle */}
            <nav className='flex items-center justify-center gap-1 h-8 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100 dark:bg-neutral-900 dark:border-neutral-700 w-full flex-shrink-0'>
                <button 
                    onClick={handleViewModeToggle}
                    className={`flex flex-1 justify-center items-center py-1 px-2 rounded-lg transition-[border,box-shadow,transform,color,opacity] ${
                        viewMode === 'thumbnails' 
                            ? 'bg-white border border-stroke-200 shadow-middle dark:bg-dark-gradient dark:border-dark-border' 
                            : 'bg-transparent '
                    }`}
                    aria-label="Thumbnail view"
                    title="Thumbnail view"
                >
                    <NewTaskIconPdf className="w-4 h-4" />
                </button>
                
                <button 
                    onClick={handleViewModeToggle}
                    className={`flex flex-1 items-center justify-center py-1 px-2 rounded-lg transition-[border,box-shadow,transform,color,opacity] ${
                        viewMode === 'list' 
                            ? 'bg-white border border-stroke-200 shadow-middle dark:bg-dark-gradient dark:border-dark-border' 
                            : 'bg-transparent '
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