'use client';
import React, { useEffect, useRef } from 'react';

const PdfPageCanvas = ({ pdfDoc, pageNumber, zoomLevel }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!pdfDoc) return;

        let cancelled = false;
        let renderTask = null;

        const render = async () => {
            const page = await pdfDoc.getPage(pageNumber);
            if (cancelled) return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            const viewport = page.getViewport({ scale: zoomLevel / 100 });

            // The backing store is scaled by the device pixel ratio, otherwise
            // the page looks soft on retina and high-DPI Windows displays.
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

        render().catch((error) => {
            // Cancelling a render on zoom change is expected, not a failure
            if (error?.name !== 'RenderingCancelledException') {
                console.error('Page render error:', error);
            }
        });

        return () => {
            cancelled = true;
            renderTask?.cancel();
        };
    }, [pdfDoc, pageNumber, zoomLevel]);

    return (
        <canvas
            ref={canvasRef}
            className='bg-white shadow-2xl max-w-full'
            aria-label={`Page ${pageNumber}`}
        />
    );
};

export default PdfPageCanvas;