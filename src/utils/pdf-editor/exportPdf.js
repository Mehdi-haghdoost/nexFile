import { PDFDocument, degrees, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { BLANK_PAGE_SIZE } from '@/utils/constants/pdfEditorConstants';
import { layoutTextBox } from '@/utils/pdf-editor/textBoxLayout';
import { reshapeText, reorderLineToVisual } from '@/utils/pdf-editor/persianText';

const HIGHLIGHT_MIN_WIDTH = 12;
const FONT_URL = '/fonts/Vazirmatn-Regular.ttf';

// One 90-degree rotation step
const rotatePointCW = (p) => ({ x: 1 - p.y, y: p.x });
const rotatePointCCW = (p) => ({ x: p.y, y: 1 - p.x });

// Un-rotates a stored (view-space) fraction back to the page's own native orientation
const toNativeFraction = (point, totalRotationDegrees) => {
    const steps = (((totalRotationDegrees % 360) + 360) % 360) / 90;
    let result = point;
    for (let i = 0; i < steps; i += 1) result = rotatePointCCW(result);
    return result;
};

// PDF space has a bottom-left origin; stored fractions use a top-left origin like the DOM
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

// Re-encodes any browser-decodable image format into PNG, since pdf-lib only embeds PNG or JPEG
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

const drawImageSignatureOnPage = async (pdfDoc, page, box, totalRotationDegrees, nativeWidth, nativeHeight) => {
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

// Renders in the shared Vazirmatn font, not the decorative script font chosen on screen
const drawTypedSignatureOnPage = (page, box, font, totalRotationDegrees, nativeWidth, nativeHeight) => {
    const topLeft = toPdfPoint({ x: box.x, y: box.y }, totalRotationDegrees, nativeWidth, nativeHeight);
    const bottomRight = toPdfPoint(
        { x: box.x + box.width, y: box.y + box.height },
        totalRotationDegrees,
        nativeWidth,
        nativeHeight
    );

    const boxHeightPt = Math.abs(topLeft.y - bottomRight.y);
    const fontSize = boxHeightPt * 0.6;

    const shaped = reshapeText(box.data.text || '');
    if (!shaped) return;

    const flatStyles = shaped.split('').map(() => ({ color: '#000000', fontSize }));
    const { chars } = reorderLineToVisual(shaped, flatStyles);

    page.drawText(chars.join(''), {
        x: Math.min(topLeft.x, bottomRight.x),
        // Rough vertical centering of a single line within the box
        y: Math.min(topLeft.y, bottomRight.y) + boxHeightPt * 0.2,
        size: fontSize,
        font,
        color: hexToRgbColor('#000000'),
    });
};

// Bakes one text box's possibly multi-line, mixed-style content
const drawTextBoxOnPage = (page, box, font, totalRotationDegrees, nativeWidth, nativeHeight) => {
    const isSideways = totalRotationDegrees % 180 !== 0;
    // Wrap width uses whichever native axis currently plays "width" after
    // rotation, matching what's actually shown on screen right now.
    const wrapWidthPt = (isSideways ? nativeHeight : nativeWidth) * box.width;

    const wrappedLines = layoutTextBox(box, {
        wrapWidthPt,
        measureWidth: (char, fontSize) => font.widthOfTextAtSize(char, fontSize),
    });

    const topPdf = toPdfPoint({ x: box.x, y: box.y }, totalRotationDegrees, nativeWidth, nativeHeight);

    let cursorYOffset = 0;

    wrappedLines.forEach((line) => {
        cursorYOffset += line.maxFontSize * 1.3;
        const lineY = topPdf.y - cursorYOffset;

        // RTL lines anchor from the box's right edge; LTR from its left
        let cursorX = line.direction === 'rtl' ? topPdf.x + wrapWidthPt - line.width : topPdf.x;

        line.runs.forEach((run) => {
            page.drawText(run.text, {
                x: cursorX,
                y: lineY,
                size: run.fontSize,
                font,
                color: hexToRgbColor(run.color),
            });
            cursorX += run.text.split('').reduce((sum, char) => sum + font.widthOfTextAtSize(char, run.fontSize), 0);
        });
    });
};

const loadEmbeddedFont = async (pdfDoc) => {
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = await fetch(FONT_URL).then((res) => res.arrayBuffer());
    // Not subsetting: subsetting a complex-script font is more failure-prone
    // than the extra file size is worth here.
    return pdfDoc.embedFont(fontBytes, { subset: false });
};

// Builds the final PDF bytes from the original file plus everything the
// editor is currently tracking.
export const buildExportedPdf = async ({
    originalArrayBuffer,
    pages,
    annotationsByPage,
    textBoxesByPage,
    signatureBoxesByPage,
}) => {
    const srcDoc = await PDFDocument.load(originalArrayBuffer);
    const outDoc = await PDFDocument.create();
    const font = await loadEmbeddedFont(outDoc);

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

        (textBoxesByPage[entry.id] || []).forEach((box) =>
            drawTextBoxOnPage(page, box, font, totalRotation, nativeWidth, nativeHeight)
        );

        for (const box of signatureBoxesByPage[entry.id] || []) {
            if (box.type === 'type') {
                drawTypedSignatureOnPage(page, box, font, totalRotation, nativeWidth, nativeHeight);
            } else {
                await drawImageSignatureOnPage(outDoc, page, box, totalRotation, nativeWidth, nativeHeight);
            }
        }
    }

    return outDoc.save();
};