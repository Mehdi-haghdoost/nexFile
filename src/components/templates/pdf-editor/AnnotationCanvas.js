'use client';
import React, { useEffect, useRef } from 'react';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import usePdfAnnotationsStore from '@/store/features/pdf-editor/pdfAnnotationsStore';

const HIGHLIGHT_MIN_WIDTH = 12;

// Points are stored as fractions (0..1) of the page's displayed width and
// height, not pixels. A fraction survives zoom changes untouched, so a line
// drawn at 100% still lines up with the text after zooming to 200%.
const toPixelPoint = (point, width, height) => ({
    x: point.x * width,
    y: point.y * height,
});

const distanceToSegment = (p, a, b) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lengthSquared = dx * dx + dy * dy;

    if (lengthSquared === 0) {
        return Math.hypot(p.x - a.x, p.y - a.y);
    }

    let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t));

    return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
};

const AnnotationCanvas = ({ pageNumber, width, height }) => {
    const canvasRef = useRef(null);
    // The in-progress stroke is kept out of React state so a pointer move
    // does not trigger a re-render on every event.
    const drawingRef = useRef(null);

    const { activeEditingTool, toolSettings, zoomLevel } = usePdfEditorStore();
    const { annotationsByPage, addStroke, removeStroke } = usePdfAnnotationsStore();

    const strokes = annotationsByPage[pageNumber] || [];
    const isDrawTool = activeEditingTool === 'draw' || activeEditingTool === 'highlight';
    const isErasing = isDrawTool && toolSettings.isEraserActive;

    const drawStroke = (ctx, stroke) => {
        if (stroke.points.length === 0) return;

        ctx.save();
        ctx.globalAlpha = stroke.opacity / 100;
        ctx.strokeStyle = stroke.color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalCompositeOperation = stroke.tool === 'highlight' ? 'multiply' : 'source-over';

        ctx.lineWidth = stroke.tool === 'highlight'
            ? Math.max(stroke.strokeWidth * 4, HIGHLIGHT_MIN_WIDTH) * (zoomLevel / 100)
            : stroke.strokeWidth * (zoomLevel / 100);

        ctx.beginPath();
        stroke.points.forEach((point, index) => {
            const pixel = toPixelPoint(point, width, height);
            if (index === 0) ctx.moveTo(pixel.x, pixel.y);
            else ctx.lineTo(pixel.x, pixel.y);
        });
        ctx.stroke();
        ctx.restore();
    };

    const redraw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Clear in raw device pixels regardless of the ratio transform set
        // on resize, otherwise clearRect only wipes a scaled-down corner of
        // the actual backing store.
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        strokes.forEach((stroke) => drawStroke(ctx, stroke));
        if (drawingRef.current) drawStroke(ctx, drawingRef.current);
    };

    // Backing store follows the same device-pixel-ratio scaling as the PDF
    // canvas underneath, otherwise strokes look soft on high-DPI screens.
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !width || !height) return;

        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);

        redraw();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, height]);

    useEffect(redraw, [strokes]);

    const getRelativePoint = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) / rect.width,
            y: (event.clientY - rect.top) / rect.height,
        };
    };

    const eraseAt = (point) => {
        const pixelPoint = toPixelPoint(point, width, height);
        const hitRadius = Math.max(toolSettings.strokeWidth * (zoomLevel / 100), 8);

        // Iterate from the most recently drawn stroke so the one visually
        // on top is the one erased.
        for (let i = strokes.length - 1; i >= 0; i -= 1) {
            const stroke = strokes[i];
            const pixelPoints = stroke.points.map((p) => toPixelPoint(p, width, height));

            const isHit = pixelPoints.some((p, index) => {
                if (index === 0) return Math.hypot(pixelPoint.x - p.x, pixelPoint.y - p.y) <= hitRadius;
                return distanceToSegment(pixelPoint, pixelPoints[index - 1], p) <= hitRadius;
            });

            if (isHit) {
                removeStroke(pageNumber, stroke.id);
                return;
            }
        }
    };

    const handlePointerDown = (event) => {
        if (!isDrawTool) return;
        event.currentTarget.setPointerCapture(event.pointerId);

        const point = getRelativePoint(event);

        if (isErasing) {
            eraseAt(point);
            return;
        }

        drawingRef.current = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
            tool: activeEditingTool,
            color: toolSettings.color,
            opacity: toolSettings.opacity,
            strokeWidth: toolSettings.strokeWidth,
            points: [point],
        };
        redraw();
    };

    const handlePointerMove = (event) => {
        if (!isDrawTool) return;

        const point = getRelativePoint(event);

        if (isErasing) {
            if (event.buttons === 1) eraseAt(point);
            return;
        }

        if (!drawingRef.current) return;
        drawingRef.current.points.push(point);
        redraw();
    };

    const handlePointerUp = () => {
        if (!drawingRef.current) return;

        // A single click with no movement is not a useful stroke
        if (drawingRef.current.points.length > 1) {
            addStroke(pageNumber, drawingRef.current);
        }
        drawingRef.current = null;
        redraw();
    };

    return (
        <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className='absolute inset-0'
            style={{
                width: `${width}px`,
                height: `${height}px`,
                touchAction: isDrawTool ? 'none' : 'auto',
                cursor: isDrawTool ? (isErasing ? 'cell' : 'crosshair') : 'default',
                pointerEvents: isDrawTool ? 'auto' : 'none',
            }}
        />
    );
};

export default AnnotationCanvas;