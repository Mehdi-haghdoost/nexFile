'use client';
import React, { useEffect, useState } from 'react';
import PdfPageCanvas from './PdfPageCanvas';
import AnnotationCanvas from './AnnotationCanvas';
import TextBoxLayer from './TextBoxLayer';

// pdf.js caches parsed page objects internally, so PdfPageCanvas fetching the
// same page again below is a cache hit, not a re-parse.
const PdfPageView = ({ pdfDoc, pageNumber, zoomLevel }) => {
    const [size, setSize] = useState(null);

    useEffect(() => {
        if (!pdfDoc) return;

        let cancelled = false;

        pdfDoc.getPage(pageNumber).then((page) => {
            if (cancelled) return;
            const viewport = page.getViewport({ scale: zoomLevel / 100 });
            setSize({
                width: Math.floor(viewport.width),
                height: Math.floor(viewport.height),
            });
        });

        return () => {
            cancelled = true;
        };
    }, [pdfDoc, pageNumber, zoomLevel]);

    return (
        <div
            className='relative flex-shrink-0'
            style={size ? { width: size.width, height: size.height } : undefined}
        >
            <PdfPageCanvas pdfDoc={pdfDoc} pageNumber={pageNumber} zoomLevel={zoomLevel} />
            {size && (
                <>
                    <AnnotationCanvas pageNumber={pageNumber} width={size.width} height={size.height} />
                    <TextBoxLayer pageNumber={pageNumber} width={size.width} height={size.height} />
                </>
            )}
        </div>
    );
};

export default PdfPageView;