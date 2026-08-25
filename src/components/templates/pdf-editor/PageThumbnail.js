'use client';
import React, { useEffect, useRef, useState } from 'react';

const THUMBNAIL_WIDTH = 112;

const PageThumbnail = ({ pdfDoc, pageNumber, isSelected, onClick }) => {
    const wrapperRef = useRef(null);
    const canvasRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    // Only thumbnails that scroll into view are rasterised. A long document
    // would otherwise render every page up front and lock up the worker.
    useEffect(() => {
        const node = wrapperRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible || !pdfDoc) return;

        let cancelled = false;
        let renderTask = null;

        const render = async () => {
            const page = await pdfDoc.getPage(pageNumber);
            if (cancelled) return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            // Scale from the page's own width so portrait and landscape pages
            // both fit the sidebar column.
            const unscaled = page.getViewport({ scale: 1 });
            const viewport = page.getViewport({
                scale: THUMBNAIL_WIDTH / unscaled.width,
            });

            const ratio = window.devicePixelRatio || 1;

            canvas.width = Math.floor(viewport.width * ratio);
            canvas.height = Math.floor(viewport.height * ratio);
            canvas.style.width = `${THUMBNAIL_WIDTH}px`;
            canvas.style.height = `${Math.floor(viewport.height)}px`;

            renderTask = page.render({
                canvasContext: canvas.getContext('2d'),
                viewport,
                transform: ratio === 1 ? null : [ratio, 0, 0, ratio, 0, 0],
            });

            await renderTask.promise;
        };

        render().catch((error) => {
            if (error?.name !== 'RenderingCancelledException') {
                console.error('Thumbnail render error:', error);
            }
        });

        return () => {
            cancelled = true;
            renderTask?.cancel();
        };
    }, [isVisible, pdfDoc, pageNumber]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick(pageNumber);
        }
    };

    return (
        <article ref={wrapperRef} className='flex flex-col items-center gap-2'>
            <div
                className={`flex items-center justify-center w-[112px] min-h-[140px] rounded border-[1.5px] bg-white overflow-hidden cursor-pointer transition-[border,box-shadow,transform,color,opacity] hover:shadow-md ${
                    isSelected
                        ? 'border-primary-500 shadow-sm'
                        : 'border-stroke-500 hover:border-primary-300'
                }`}
                onClick={() => onClick(pageNumber)}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                aria-label={`Page ${pageNumber}`}
                aria-pressed={isSelected}
            >
                <canvas ref={canvasRef} className='block' />
            </div>

            <span className='text-medium-14 dark:text-medium-14-white select-none'>{pageNumber}</span>
        </article>
    );
};

export default PageThumbnail;