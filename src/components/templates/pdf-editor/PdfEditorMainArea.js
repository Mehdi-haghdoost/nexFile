'use client';
import React, { useEffect, useRef } from 'react';
import DrawToolbar from './DrawToolbar';
import PdfPageCanvas from './PdfPageCanvas';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';

const PdfEditorMainArea = () => {
    const {
        pdfDoc,
        totalPages,
        zoomLevel,
        currentPage,
        activeEditingTool,
        setCurrentPage,
    } = usePdfEditorStore();

    const scrollRef = useRef(null);
    const pageRefs = useRef({});

    // Remembers the page the observer reported, so the scroll effect below can
    // tell a toolbar or thumbnail click apart from the user simply scrolling.
    const observedPage = useRef(1);

    useEffect(() => {
        const root = scrollRef.current;
        if (!root || !pdfDoc) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (!visible) return;

                const pageNumber = Number(visible.target.dataset.page);
                observedPage.current = pageNumber;
                setCurrentPage(pageNumber);
            },
            { root, threshold: [0.3, 0.6] }
        );

        Object.values(pageRefs.current).forEach((node) => {
            if (node) observer.observe(node);
        });

        return () => observer.disconnect();
    }, [pdfDoc, totalPages, setCurrentPage]);

    useEffect(() => {
        // Scrolling here while the observer is the one driving the change would
        // fight the user's own scrolling.
        if (observedPage.current === currentPage) return;

        pageRefs.current[currentPage]?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }, [currentPage]);

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <main className='flex flex-1 flex-col items-center bg-stroke-200 dark:bg-neutral-700 overflow-hidden'>
            {/* Draw toolbar - desktop only */}
            {activeEditingTool === 'draw' && (
                <div className='hidden lg:block w-full flex-shrink-0'>
                    <DrawToolbar />
                </div>
            )}

            <div
                ref={scrollRef}
                className='flex-1 w-full overflow-auto p-4 lg:p-6'
            >
                <div className='flex flex-col items-center gap-6 w-fit min-w-full'>
                    {pages.map((pageNumber) => (
                        <div
                            key={pageNumber}
                            data-page={pageNumber}
                            ref={(node) => {
                                pageRefs.current[pageNumber] = node;
                            }}
                            className='flex-shrink-0'
                        >
                            <PdfPageCanvas
                                pdfDoc={pdfDoc}
                                pageNumber={pageNumber}
                                zoomLevel={zoomLevel}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default PdfEditorMainArea;