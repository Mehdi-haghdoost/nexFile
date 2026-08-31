'use client';
import React, { useState, useRef } from 'react';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import usePdfAnnotationsStore from '@/store/features/pdf-editor/pdfAnnotationsStore';
import SignaturePreview from './shared/SignaturePreview';

const DEFAULT_WIDTH_FRACTION = 0.25;
const DEFAULT_HEIGHT_FRACTION = 0.08;
const MIN_SIZE_PX = 24;

const DragHandleIcon = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="text-neutral-500 dark:text-white">
        <circle cx="2" cy="2" r="1" /><circle cx="5" cy="2" r="1" /><circle cx="8" cy="2" r="1" />
        <circle cx="2" cy="5" r="1" /><circle cx="5" cy="5" r="1" /><circle cx="8" cy="5" r="1" />
        <circle cx="2" cy="8" r="1" /><circle cx="5" cy="8" r="1" /><circle cx="8" cy="8" r="1" />
    </svg>
);

const PlacedSignatureBox = ({ box, pageWidth, pageHeight, isActive, onSelect, onMove, onResize, onDelete }) => {
    const dragStartRef = useRef(null);
    const resizeStartRef = useRef(null);
    const [dragOffset, setDragOffset] = useState(null);
    const [resizeOffset, setResizeOffset] = useState(null);

    const handleDragPointerDown = (event) => {
        event.stopPropagation();
        event.preventDefault();
        onSelect();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragStartRef.current = { clientX: event.clientX, clientY: event.clientY };
        setDragOffset({ dx: 0, dy: 0 });
    };

    const handleDragPointerMove = (event) => {
        if (!dragStartRef.current) return;
        setDragOffset({
            dx: (event.clientX - dragStartRef.current.clientX) / pageWidth,
            dy: (event.clientY - dragStartRef.current.clientY) / pageHeight,
        });
    };

    const handleDragPointerUp = () => {
        if (!dragStartRef.current || !dragOffset) return;
        onMove(box.x + dragOffset.dx, box.y + dragOffset.dy);
        dragStartRef.current = null;
        setDragOffset(null);
    };

    const handleResizePointerDown = (event) => {
        event.stopPropagation();
        event.preventDefault();
        onSelect();
        event.currentTarget.setPointerCapture(event.pointerId);
        resizeStartRef.current = { clientX: event.clientX, clientY: event.clientY };
        setResizeOffset({ dw: 0, dh: 0 });
    };

    const handleResizePointerMove = (event) => {
        if (!resizeStartRef.current) return;
        setResizeOffset({
            dw: (event.clientX - resizeStartRef.current.clientX) / pageWidth,
            dh: (event.clientY - resizeStartRef.current.clientY) / pageHeight,
        });
    };

    const handleResizePointerUp = () => {
        if (!resizeStartRef.current || !resizeOffset) return;
        onResize(
            Math.max(box.width + resizeOffset.dw, MIN_SIZE_PX / pageWidth),
            Math.max(box.height + resizeOffset.dh, MIN_SIZE_PX / pageHeight)
        );
        resizeStartRef.current = null;
        setResizeOffset(null);
    };

    const currentX = box.x + (dragOffset?.dx || 0);
    const currentY = box.y + (dragOffset?.dy || 0);
    const currentWidth = Math.max(box.width + (resizeOffset?.dw || 0), MIN_SIZE_PX / pageWidth);
    const currentHeight = Math.max(box.height + (resizeOffset?.dh || 0), MIN_SIZE_PX / pageHeight);

    return (
        <div
            className='absolute'
            style={{
                left: `${currentX * pageWidth}px`,
                top: `${currentY * pageHeight}px`,
                width: `${currentWidth * pageWidth}px`,
                height: `${currentHeight * pageHeight}px`,
            }}
        >
            {isActive && (
                <>
                    <button
                        type='button'
                        onPointerDown={handleDragPointerDown}
                        onPointerMove={handleDragPointerMove}
                        onPointerUp={handleDragPointerUp}
                        onPointerLeave={handleDragPointerUp}
                        className='absolute -top-3 -left-3 w-5 h-5 rounded-full bg-white dark:bg-neutral-800 border border-stroke-300 dark:border-neutral-600 shadow-light flex items-center justify-center cursor-move touch-none z-10'
                        aria-label='Move signature'
                    >
                        <DragHandleIcon />
                    </button>

                    <button
                        type='button'
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={(event) => {
                            event.stopPropagation();
                            onDelete();
                        }}
                        className='absolute -top-3 -right-3 w-5 h-5 rounded-full bg-white dark:bg-neutral-800 border border-stroke-300 dark:border-neutral-600 shadow-light flex items-center justify-center text-[10px] leading-none text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 z-10'
                        aria-label='Delete signature'
                    >
                        ×
                    </button>

                    <button
                        type='button'
                        onPointerDown={handleResizePointerDown}
                        onPointerMove={handleResizePointerMove}
                        onPointerUp={handleResizePointerUp}
                        onPointerLeave={handleResizePointerUp}
                        className='absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-neutral-800 border border-primary-500 cursor-nwse-resize touch-none z-10'
                        aria-label='Resize signature'
                    />
                </>
            )}

            <div
                onClick={(event) => {
                    event.stopPropagation();
                    onSelect();
                }}
                className={`w-full h-full flex items-center justify-center overflow-hidden border border-dashed cursor-pointer ${
                    isActive ? 'border-primary-500' : 'border-transparent'
                }`}
            >
                <SignaturePreview
                    type={box.type}
                    data={box.data}
                    className='max-w-full max-h-full'
                    style={box.type === 'type' ? { fontSize: `${currentHeight * pageHeight * 0.6}px` } : undefined}
                />
            </div>
        </div>
    );
};

const SignatureBoxLayer = ({ pageId, width, height }) => {
    const { activeEditingTool, selectedSignature } = usePdfEditorStore();
    const { signatureBoxesByPage, addSignatureBox, moveSignatureBox, resizeSignatureBox, removeSignatureBox } = usePdfAnnotationsStore();

    const [activeId, setActiveId] = useState(null);

    const boxes = signatureBoxesByPage[pageId] || [];
    const isSignTool = activeEditingTool === 'sign';

    const handleLayerClick = (event) => {
        if (!isSignTool || !selectedSignature || event.target !== event.currentTarget) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - DEFAULT_WIDTH_FRACTION / 2;
        const y = (event.clientY - rect.top) / rect.height - DEFAULT_HEIGHT_FRACTION / 2;

        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

        addSignatureBox(pageId, {
            id,
            type: selectedSignature.type,
            data: selectedSignature.data,
            x: Math.max(x, 0),
            y: Math.max(y, 0),
            width: DEFAULT_WIDTH_FRACTION,
            height: DEFAULT_HEIGHT_FRACTION,
        });

        setActiveId(id);
    };

    return (
        <div
            className={`absolute inset-0 ${isSignTool ? (selectedSignature ? 'cursor-crosshair' : 'cursor-default') : 'pointer-events-none'}`}
            style={{ width: `${width}px`, height: `${height}px` }}
            onClick={handleLayerClick}
        >
            {boxes.map((box) => (
                <PlacedSignatureBox
                    key={box.id}
                    box={box}
                    pageWidth={width}
                    pageHeight={height}
                    isActive={isSignTool && activeId === box.id}
                    onSelect={() => setActiveId(box.id)}
                    onMove={(x, y) => moveSignatureBox(pageId, box.id, x, y)}
                    onResize={(w, h) => resizeSignatureBox(pageId, box.id, w, h)}
                    onDelete={() => {
                        setActiveId(null);
                        removeSignatureBox(pageId, box.id);
                    }}
                />
            ))}
        </div>
    );
};

export default SignatureBoxLayer;