'use client';
import React, { useEffect, useRef } from 'react';
import { BLANK_PAGE_SIZE } from '@/utils/constants/pdfEditorConstants';

const PdfPageCanvas = ({ pdfDoc, entry, zoomLevel }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        let renderTask = null;

        const renderBlank = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ratio = window.devicePixelRatio || 1;
            const scale = zoomLevel / 100;
            const width = BLANK_PAGE_SIZE.width * scale;
            const height = BLANK_PAGE_SIZE.height * scale;

            canvas.width = Math.floor(width * ratio);
            canvas.height = Math.floor(height * ratio);
            canvas.style.width = `${Math.floor(width)}px`;
            canvas.style.height = `${Math.floor(height)}px`;

            const ctx = canvas.getContext('2d');
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
        };

        const renderSourcePage = async () => {
            const page = await pdfDoc.getPage(entry.sourcePageNumber);
            if (cancelled) return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            const rotation = (page.rotate + entry.rotation) % 360;
            const viewport = page.getViewport({ scale: zoomLevel / 100, rotation });

            const ratio = window.devicePixelRatio || 1;

            canvas.width = Math.floor(viewport.width * ratio);
            canvas.height = Math.floor(viewport.height * ratio);
            canvas.style.width = `${Math.floor(viewport.width)}px`;
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
                    console.error('Page render error:', error);
                }
            });
        }

        return () => {
            cancelled = true;
            renderTask?.cancel();
        };
    }, [pdfDoc, entry, zoomLevel]);

    return (
        <canvas
            ref={canvasRef}
            className='bg-white shadow-2xl max-w-full'
            aria-label={entry.sourcePageNumber === null ? 'Blank page' : `Page ${entry.sourcePageNumber}`}
        />
    );
};

export default PdfPageCanvas;