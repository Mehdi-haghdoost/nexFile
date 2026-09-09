'use client';
import React, { useEffect, useRef } from 'react';
import DrawToolbar from './DrawToolbar';
import AddTextToolbar from './AddTextToolbar';
import SignToolbar from './SignToolbar';
import PdfPageView from './PdfPageView';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import usePdfPagesStore from '@/store/features/pdf-editor/pdfPagesStore';
import { BLANK_PAGE_SIZE } from '@/utils/constants/pdfEditorConstants';

// Matches the container's horizontal padding so the fitted page isn't clipped
const VIEWER_PADDING_PX = 48;

const PdfEditorMainArea = () => {
    const { pdfDoc, zoomLevel, zoomMode, activeEditingTool, applyFitZoom } = usePdfEditorStore();
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

    // Recomputes the fit scale from the current page's unscaled width whenever
    // the viewer resizes, the page changes, or its rotation changes.
    useEffect(() => {
        if (zoomMode !== 'fit') return;

        const root = scrollRef.current;
        const entry = pages[currentPage - 1];
        if (!root || !entry) return;

        let cancelled = false;

        const recompute = async () => {
            let pageWidth = BLANK_PAGE_SIZE.width;

            if (entry.sourcePageNumber !== null && pdfDoc) {
                const page = await pdfDoc.getPage(entry.sourcePageNumber);
                if (cancelled) return;
                const rotation = (page.rotate + entry.rotation) % 360;
                pageWidth = page.getViewport({ scale: 1, rotation }).width;
            } else if (entry.rotation % 180 !== 0) {
                pageWidth = BLANK_PAGE_SIZE.height;
            }

            const available = root.clientWidth - VIEWER_PADDING_PX;
            if (available > 0) applyFitZoom((available / pageWidth) * 100);
        };

        recompute();

        const observer = new ResizeObserver(recompute);
        observer.observe(root);

        return () => {
            cancelled = true;
            observer.disconnect();
        };
    }, [zoomMode, pages, currentPage, pdfDoc, applyFitZoom]);

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