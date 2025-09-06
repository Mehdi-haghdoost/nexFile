"use client";
import React, { useState } from 'react';
import { NewTaskIconPdf, FilterListButtonIcon } from '@/components/ui/icons';
import PageThumbnail from './PageThumbnail';

const PdfEditorSidebar = () => {
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
        // Emit page change event or call parent handler
        console.log(`Selected page: ${pageNumber}`);
    };

    const handleViewModeToggle = () => {
        setViewMode(prev => prev === 'thumbnails' ? 'list' : 'thumbnails');
    };

    return (
        <aside className='flex flex-col justify-center items-center py-8 px-6 gap-8 w-[200px] self-stretch border-r border-t border-stroke-200 bg-white'>
            {/* Page Thumbnails Container */}
            <div className='flex flex-1 flex-col items-center gap-8 self-stretch overflow-y-auto'>
                <div className='flex flex-col items-center gap-4 w-full'>
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
            </div>

            {/* View Controls */}
            <nav className='flex items-center justify-center gap-1 h-8 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100'>
                <button
                    onClick={handleViewModeToggle}
                    className={`flex justify-center items-center gap-1.5 self-stretch py-[13px] px-[9px] rounded-lg border transition-colors ${viewMode === 'thumbnails'
                            ? 'border-stroke-200 shadow-middle bg-white'
                            : 'border-transparent bg-transparent hover:bg-white/50'
                        }`}
                    aria-label="Thumbnail view"
                    title="Thumbnail view"
                >
                    <NewTaskIconPdf />
                </button>

                <button
                    onClick={handleViewModeToggle}
                    className={`flex items-center justify-center gap-2.5 self-stretch py-1 px-[9px] rounded-[5px] transition-colors ${viewMode === 'list'
                            ? 'bg-white border border-stroke-200'
                            : 'bg-transparent hover:bg-white/50'
                        }`}
                    aria-label="List view"
                    title="List view"
                >
                    <FilterListButtonIcon />
                </button>
            </nav>
        </aside>
    );
};

export default PdfEditorSidebar;