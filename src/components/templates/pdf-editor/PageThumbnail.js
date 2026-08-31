'use client';
import React, { useEffect, useRef, useState } from 'react';
import { BLANK_PAGE_SIZE } from '@/utils/constants/pdfEditorConstants';

const THUMBNAIL_WIDTH = 112;

const PageThumbnail = ({ pdfDoc, entry, displayIndex, isSelected, onClick }) => {
    const wrapperRef = useRef(null);
    const canvasRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const node = wrapperRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([observerEntry]) => {
                if (observerEntry.isIntersecting) {
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
        if (!isVisible) return;

        let cancelled = false;
        let renderTask = null;

        const renderBlank = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const scale = THUMBNAIL_WIDTH / BLANK_PAGE_SIZE.width;
            const height = BLANK_PAGE_SIZE.height * scale;
            const ratio = window.devicePixelRatio || 1;

            canvas.width = Math.floor(THUMBNAIL_WIDTH * ratio);
            canvas.height = Math.floor(height * ratio);
            canvas.style.width = `${THUMBNAIL_WIDTH}px`;
            canvas.style.height = `${Math.floor(height)}px`;

            const ctx = canvas.getContext('2d');
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, THUMBNAIL_WIDTH, height);
        };

        const renderSourcePage = async () => {
            const page = await pdfDoc.getPage(entry.sourcePageNumber);
            if (cancelled) return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            const rotation = (page.rotate + entry.rotation) % 360;
            const unscaled = page.getViewport({ scale: 1, rotation });
            const viewport = page.getViewport({
                scale: THUMBNAIL_WIDTH / unscaled.width,
                rotation,
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

        if (entry.sourcePageNumber === null) {
            renderBlank();
        } else if (pdfDoc) {
            renderSourcePage().catch((error) => {
                if (error?.name !== 'RenderingCancelledException') {
                    console.error('Thumbnail render error:', error);
                }
            });
        }

        return () => {
            cancelled = true;
            renderTask?.cancel();
        };
    }, [isVisible, pdfDoc, entry]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick();
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
                onClick={onClick}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                aria-label={`Page ${displayIndex}`}
                aria-pressed={isSelected}
            >
                <canvas ref={canvasRef} className='block' />
            </div>

            <span className='text-medium-14 dark:text-medium-14-white select-none'>{displayIndex}</span>
        </article>
    );
};

export default PageThumbnail;