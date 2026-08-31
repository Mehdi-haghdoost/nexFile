import { PDFDocument, degrees, rgb } from 'pdf-lib';
import { BLANK_PAGE_SIZE } from '@/utils/constants/pdfEditorConstants';

const HIGHLIGHT_MIN_WIDTH = 12;

// Same single 90-degree transforms pdfAnnotationsStore uses when the user
// clicks rotate, so the math stays consistent between editing and export.
const rotatePointCW = (p) => ({ x: 1 - p.y, y: p.x });
const rotatePointCCW = (p) => ({ x: p.y, y: 1 - p.x });

// Un-rotates a stored (view-space) fraction back to the page's own native
// orientation, since /Rotate is purely a display hint the content stream
// coordinates don't know about.
const toNativeFraction = (point, totalRotationDegrees) => {
    const steps = (((totalRotationDegrees % 360) + 360) % 360) / 90;
    let result = point;
    for (let i = 0; i < steps; i += 1) result = rotatePointCCW(result);
    return result;
};

// PDF space has a bottom-left origin with y increasing upward; our stored
// fractions use a top-left origin with y increasing downward, like the DOM.
const toPdfPoint = (viewFraction, totalRotationDegrees, nativeWidth, nativeHeight) => {
    const native = toNativeFraction(viewFraction, totalRotationDegrees);
    return { x: native.x * nativeWidth, y: (1 - native.y) * nativeHeight };
};

const hexToRgbColor = (hex) => {
    const clean = hex.replace('#', '');
    return rgb(
        parseInt(clean.substring(0, 2), 16) / 255,
        parseInt(clean.substring(2, 4), 16) / 255,
        parseInt(clean.substring(4, 6), 16) / 255
    );
};

const drawStrokeOnPage = (page, stroke, totalRotationDegrees, nativeWidth, nativeHeight) => {
    if (stroke.points.length < 2) return;

    // Highlight strokes get the same thickness boost used on screen; true
    // multiply blending would need custom ExtGState content operators, so
    // plain alpha transparency stands in as a close approximation.
    const lineWidth = stroke.tool === 'highlight'
        ? Math.max(stroke.strokeWidth * 4, HIGHLIGHT_MIN_WIDTH)
        : stroke.strokeWidth;

    const pdfPoints = stroke.points.map((p) => toPdfPoint(p, totalRotationDegrees, nativeWidth, nativeHeight));

    for (let i = 1; i < pdfPoints.length; i += 1) {
        page.drawLine({
            start: pdfPoints[i - 1],
            end: pdfPoints[i],
            thickness: lineWidth,
            color: hexToRgbColor(stroke.color),
            opacity: stroke.opacity / 100,
        });
    }
};

// Re-encodes any image format the browser can decode into PNG, so gif/webp/
// bmp uploads (pdf-lib only embeds PNG or JPEG) still work.
const toPngDataUrl = (dataUrl) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvas.getContext('2d').drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = dataUrl;
    });

const drawSignatureOnPage = async (pdfDoc, page, box, totalRotationDegrees, nativeWidth, nativeHeight) => {
    // Typed signatures need an embedded font; that lands with text-box baking.
    if (box.type === 'type') return;

    const isJpeg = box.data.startsWith('data:image/jpeg') || box.data.startsWith('data:image/jpg');
    const isPng = box.data.startsWith('data:image/png');
    const finalDataUrl = isJpeg || isPng ? box.data : await toPngDataUrl(box.data);

    const base64 = finalDataUrl.split(',')[1];
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const image = isJpeg ? await pdfDoc.embedJpg(bytes) : await pdfDoc.embedPng(bytes);

    const topLeft = toPdfPoint({ x: box.x, y: box.y }, totalRotationDegrees, nativeWidth, nativeHeight);
    const bottomRight = toPdfPoint(
        { x: box.x + box.width, y: box.y + box.height },
        totalRotationDegrees,
        nativeWidth,
        nativeHeight
    );

    page.drawImage(image, {
        x: Math.min(topLeft.x, bottomRight.x),
        y: Math.min(topLeft.y, bottomRight.y),
        width: Math.abs(bottomRight.x - topLeft.x),
        height: Math.abs(topLeft.y - bottomRight.y),
    });
};

// Builds the final PDF bytes from the original file plus everything the
// editor is currently tracking: page order (including blank inserts),
// per-page rotation, strokes, and image-based signatures.
export const buildExportedPdf = async ({ originalArrayBuffer, pages, annotationsByPage, signatureBoxesByPage }) => {
    const srcDoc = await PDFDocument.load(originalArrayBuffer);
    const outDoc = await PDFDocument.create();

    const sourceIndexes = pages
        .filter((entry) => entry.sourcePageNumber !== null)
        .map((entry) => entry.sourcePageNumber - 1);

    const copiedPages = sourceIndexes.length ? await outDoc.copyPages(srcDoc, sourceIndexes) : [];
    let copiedCursor = 0;

    for (const entry of pages) {
        let page;
        let nativeRotation = 0;

        if (entry.sourcePageNumber === null) {
            page = outDoc.addPage([BLANK_PAGE_SIZE.width, BLANK_PAGE_SIZE.height]);
        } else {
            const copied = copiedPages[copiedCursor];
            copiedCursor += 1;
            nativeRotation = copied.getRotation().angle;
            page = outDoc.addPage(copied);
        }

        const totalRotation = (nativeRotation + entry.rotation) % 360;
        page.setRotation(degrees(totalRotation));

        const nativeWidth = page.getWidth();
        const nativeHeight = page.getHeight();

        (annotationsByPage[entry.id] || []).forEach((stroke) =>
            drawStrokeOnPage(page, stroke, totalRotation, nativeWidth, nativeHeight)
        );

        for (const box of signatureBoxesByPage[entry.id] || []) {
            await drawSignatureOnPage(outDoc, page, box, totalRotation, nativeWidth, nativeHeight);
        }
    }

    return outDoc.save();
};