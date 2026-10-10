import { useCallback, useEffect, useRef, useState } from 'react';

// A fixed export width gives every signature the same resolution whatever the screen size
const EXPORT_WIDTH = 1200;

// Points and pen widths are fractions of the canvas box, so resizing never shifts the ink
const drawStrokes = (context, strokes, width, height, color) => {
    context.clearRect(0, 0, width, height);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;

    strokes.forEach((stroke) => {
        if (stroke.points.length === 0) return;

        context.lineWidth = Math.max(1, stroke.width * width);
        context.beginPath();

        const [first, ...rest] = stroke.points;
        context.moveTo(first.x * width, first.y * height);

        if (rest.length === 0) {
            // A single tap still leaves a round dot
            context.lineTo(first.x * width + 0.01, first.y * height);
        } else {
            rest.forEach((point) => context.lineTo(point.x * width, point.y * height));
        }

        context.stroke();
    });
};

const useSignatureCanvas = ({ penSize, isDarkMode }) => {
    const canvasRef = useRef(null);
    const strokesRef = useRef([]);
    const isDrawingRef = useRef(false);
    const [hasDrawn, setHasDrawn] = useState(false);

    const screenColor = isDarkMode ? '#FFFFFF' : '#000000';

    // The bitmap matches the element's real box, so the line lands under the pointer
    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const ratio = window.devicePixelRatio || 1;
        const width = Math.round(rect.width * ratio);
        const height = Math.round(rect.height * ratio);

        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }

        drawStrokes(canvas.getContext('2d'), strokesRef.current, width, height, screenColor);
    }, [screenColor]);

    useEffect(() => {
        render();

        const canvas = canvasRef.current;
        if (!canvas || typeof ResizeObserver === 'undefined') return;

        const observer = new ResizeObserver(render);
        observer.observe(canvas);

        return () => observer.disconnect();
    }, [render]);

    const toFraction = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left) / rect.width,
            y: (event.clientY - rect.top) / rect.height,
        };
    };

    // Pointer events cover mouse, touch and pen with one set of handlers
    const startStroke = (event) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        event.preventDefault();
        canvas.setPointerCapture?.(event.pointerId);
        isDrawingRef.current = true;

        const rect = canvas.getBoundingClientRect();
        strokesRef.current.push({
            width: penSize / rect.width,
            points: [toFraction(event)],
        });

        setHasDrawn(true);
        render();
    };

    const extendStroke = (event) => {
        if (!isDrawingRef.current) return;

        event.preventDefault();
        strokesRef.current[strokesRef.current.length - 1].points.push(toFraction(event));
        render();
    };

    // Pointer capture keeps the stroke alive outside the box, so leaving no longer ends it abruptly
    const endStroke = (event) => {
        if (!isDrawingRef.current) return;

        canvasRef.current?.releasePointerCapture?.(event.pointerId);
        isDrawingRef.current = false;
    };

    const clear = () => {
        strokesRef.current = [];
        setHasDrawn(false);
        render();
    };

    // Exported ink is always black on transparency, so a signature drawn in dark mode still shows on paper
    const toDataURL = () => {
        if (strokesRef.current.length === 0) return null;

        const rect = canvasRef.current?.getBoundingClientRect();
        const aspect = rect && rect.height > 0 ? rect.width / rect.height : 3;
        const height = Math.round(EXPORT_WIDTH / aspect);

        const surface = document.createElement('canvas');
        surface.width = EXPORT_WIDTH;
        surface.height = height;

        drawStrokes(surface.getContext('2d'), strokesRef.current, EXPORT_WIDTH, height, '#000000');

        return surface.toDataURL('image/png');
    };

    return { canvasRef, hasDrawn, startStroke, extendStroke, endStroke, clear, toDataURL };
};

export default useSignatureCanvas;