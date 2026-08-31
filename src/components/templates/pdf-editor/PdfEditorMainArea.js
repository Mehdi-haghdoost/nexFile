'use client';
import React, { useEffect, useRef } from 'react';
import DrawToolbar from './DrawToolbar';
import AddTextToolbar from './AddTextToolbar';
import SignToolbar from './SignToolbar';
import PdfPageView from './PdfPageView';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import usePdfPagesStore from '@/store/features/pdf-editor/pdfPagesStore';

const PdfEditorMainArea = () => {
    const { pdfDoc, zoomLevel, activeEditingTool } = usePdfEditorStore();
    const { pages, currentPage, setCurrentPage } = usePdfPagesStore();

    const scrollRef = useRef(null);
    const pageRefs = useRef({});
    const observedIndex = useRef(1);

    useEffect(() => {
        const root = scrollRef.current;
        if (!root || pages.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (!visible) return;

                const index = Number(visible.target.dataset.index);
                observedIndex.current = index;
                setCurrentPage(index);
            },
            { root, threshold: [0.3, 0.6] }
        );

        Object.values(pageRefs.current).forEach((node) => {
            if (node) observer.observe(node);
        });

        return () => observer.disconnect();
    }, [pages, setCurrentPage]);

    useEffect(() => {
        if (observedIndex.current === currentPage) return;

        const entry = pages[currentPage - 1];
        if (!entry) return;

        pageRefs.current[entry.id]?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }, [currentPage, pages]);

    const showDrawToolbar = activeEditingTool === 'draw' || activeEditingTool === 'highlight';
    const showAddTextToolbar = activeEditingTool === 'addText';
    const showSignToolbar = activeEditingTool === 'sign';

    return (
        <main className='flex flex-1 min-w-0 flex-col items-center bg-stroke-200 dark:bg-neutral-700 overflow-hidden'>
            {showDrawToolbar && (
                <div className='hidden lg:block w-full flex-shrink-0'>
                    <DrawToolbar />
                </div>
            )}

            {showAddTextToolbar && (
                <div className='hidden lg:block w-full flex-shrink-0'>
                    <AddTextToolbar />
                </div>
            )}

            {showSignToolbar && (
                <div className='hidden lg:block w-full flex-shrink-0'>
                    <SignToolbar />
                </div>
            )}

            <div ref={scrollRef} className='flex-1 min-w-0 w-full overflow-auto p-4 lg:p-6'>
                <div className='flex flex-col items-center gap-6 w-full'>
                    {pages.map((entry, index) => (
                        <div
                            key={entry.id}
                            data-index={index + 1}
                            ref={(node) => {
                                pageRefs.current[entry.id] = node;
                            }}
                            className='flex-shrink-0'
                        >
                            <PdfPageView pdfDoc={pdfDoc} entry={entry} zoomLevel={zoomLevel} />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default PdfEditorMainArea;