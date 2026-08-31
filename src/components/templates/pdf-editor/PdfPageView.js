'use client';
import React, { useEffect, useState } from 'react';
import PdfPageCanvas from './PdfPageCanvas';
import AnnotationCanvas from './AnnotationCanvas';
import TextBoxLayer from './TextBoxLayer';
import SignatureBoxLayer from './SignatureBoxLayer';
import { BLANK_PAGE_SIZE } from '@/utils/constants/pdfEditorConstants';

const PdfPageView = ({ pdfDoc, entry, zoomLevel }) => {
    const [size, setSize] = useState(null);

    useEffect(() => {
        if (entry.sourcePageNumber === null) {
            const scale = zoomLevel / 100;
            setSize({
                width: Math.floor(BLANK_PAGE_SIZE.width * scale),
                height: Math.floor(BLANK_PAGE_SIZE.height * scale),
            });
            return;
        }

        if (!pdfDoc) return;

        let cancelled = false;

        pdfDoc.getPage(entry.sourcePageNumber).then((page) => {
            if (cancelled) return;
            const rotation = (page.rotate + entry.rotation) % 360;
            const viewport = page.getViewport({ scale: zoomLevel / 100, rotation });
            setSize({
                width: Math.floor(viewport.width),
                height: Math.floor(viewport.height),
            });
        });

        return () => {
            cancelled = true;
        };
    }, [pdfDoc, entry, zoomLevel]);

    return (
        <div
            className='relative flex-shrink-0'
            style={size ? { width: size.width, height: size.height } : undefined}
        >
            <PdfPageCanvas pdfDoc={pdfDoc} entry={entry} zoomLevel={zoomLevel} />
            {size && (
                <>
                    <AnnotationCanvas pageId={entry.id} width={size.width} height={size.height} />
                    <TextBoxLayer pageId={entry.id} width={size.width} height={size.height} />
                    <SignatureBoxLayer pageId={entry.id} width={size.width} height={size.height} />
                </>
            )}
        </div>
    );
};

export default PdfPageView;