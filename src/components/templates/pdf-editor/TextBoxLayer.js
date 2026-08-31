'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import usePdfAnnotationsStore from '@/store/features/pdf-editor/pdfAnnotationsStore';
import { sanitizeRichText, stripHtml } from '@/utils/pdf-editor/richText';

const DEFAULT_BOX_WIDTH_FRACTION = 0.4;

const DragHandleIcon = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="text-neutral-500 dark:text-white">
        <circle cx="2" cy="2" r="1" /><circle cx="5" cy="2" r="1" /><circle cx="8" cy="2" r="1" />
        <circle cx="2" cy="5" r="1" /><circle cx="5" cy="5" r="1" /><circle cx="8" cy="5" r="1" />
        <circle cx="2" cy="8" r="1" /><circle cx="5" cy="8" r="1" /><circle cx="8" cy="8" r="1" />
    </svg>
);

const EditableTextBox = ({
    box,
    pageWidth,
    pageHeight,
    zoomLevel,
    isEditing,
    onFocus,
    onBlur,
    onCommitContent,
    onMovePosition,
    onUpdateStyle,
    onDelete,
    onRegisterFormatHandler,
}) => {
    const contentRef = useRef(null);
    const initializedRef = useRef(false);

    const [dragOffset, setDragOffset] = useState(null);
    const dragStartRef = useRef(null);

    useEffect(() => {
        if (initializedRef.current || !contentRef.current) return;
        contentRef.current.innerHTML = box.content;
        initializedRef.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const commitContent = useCallback(() => {
        if (!contentRef.current) return;
        onCommitContent(sanitizeRichText(contentRef.current.innerHTML));
    }, [onCommitContent]);

    const applyFormatting = useCallback((patch) => {
        const selection = window.getSelection();
        const hasLiveSelection =
            selection &&
            selection.rangeCount > 0 &&
            !selection.isCollapsed &&
            contentRef.current?.contains(selection.anchorNode);

        if (!hasLiveSelection) {
            onUpdateStyle(patch);
            return;
        }

        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        if (patch.color) span.style.color = patch.color;
        if (patch.fontSize) {
            span.style.fontSize = `${patch.fontSize / box.fontSize}em`;
        }

        span.appendChild(range.extractContents());
        range.insertNode(span);

        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        selection.removeAllRanges();
        selection.addRange(newRange);

        commitContent();
    }, [box.fontSize, commitContent, onUpdateStyle]);

    const handleFocus = () => {
        onFocus();
        onRegisterFormatHandler(applyFormatting);
    };

    const handleBlurInternal = () => {
        commitContent();
        onRegisterFormatHandler(null);
        onBlur();
    };

    const handleDragPointerDown = (event) => {
        event.stopPropagation();
        event.preventDefault();
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
        onMovePosition(box.x + dragOffset.dx, box.y + dragOffset.dy);
        dragStartRef.current = null;
        setDragOffset(null);
    };

    const currentX = box.x + (dragOffset?.dx || 0);
    const currentY = box.y + (dragOffset?.dy || 0);

    return (
        <div
            className='absolute'
            style={{
                left: `${currentX * pageWidth}px`,
                top: `${currentY * pageHeight}px`,
                width: `${box.width * pageWidth}px`,
            }}
        >
            <button
                type='button'
                onPointerDown={handleDragPointerDown}
                onPointerMove={handleDragPointerMove}
                onPointerUp={handleDragPointerUp}
                onPointerLeave={handleDragPointerUp}
                className='absolute -top-3 -left-3 w-5 h-5 rounded-full bg-white dark:bg-neutral-800 border border-stroke-300 dark:border-neutral-600 shadow-light flex items-center justify-center cursor-move touch-none z-10'
                aria-label='Move text box'
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
                aria-label='Delete text box'
            >
                ×
            </button>

            <div
                ref={contentRef}
                contentEditable
                suppressContentEditableWarning
                dir='auto'
                onFocus={handleFocus}
                onBlur={handleBlurInternal}
                onInput={commitContent}
                onClick={(event) => event.stopPropagation()}
                data-placeholder='Type here'
                className={`w-full whitespace-pre-wrap break-words leading-[1.3] font-[inherit] outline-none p-0 empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-200 dark:empty:before:text-neutral-500 border border-dashed ${
                    isEditing ? 'border-primary-500' : 'border-transparent'
                }`}
                style={{
                    fontSize: `${box.fontSize * (zoomLevel / 100)}px`,
                    color: box.color,
                }}
            />
        </div>
    );
};

const TextBoxLayer = ({ pageId, width, height }) => {
    const { activeEditingTool, toolSettingsByTool, zoomLevel, setActiveTextFormatHandler } = usePdfEditorStore();
    const {
        textBoxesByPage,
        addTextBox,
        updateTextBoxContent,
        updateTextBoxStyle,
        moveTextBox,
        removeTextBox,
    } = usePdfAnnotationsStore();

    const [editingId, setEditingId] = useState(null);

    const textBoxes = textBoxesByPage[pageId] || [];
    const isAddTextTool = activeEditingTool === 'addText';
    const textSettings = toolSettingsByTool.text;

    const handleLayerClick = (event) => {
        if (!isAddTextTool || event.target !== event.currentTarget) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

        addTextBox(pageId, {
            id,
            x,
            y,
            width: DEFAULT_BOX_WIDTH_FRACTION,
            fontSize: textSettings.fontSize,
            color: textSettings.color,
            content: '',
        });

        setEditingId(id);
    };

    const handleBlur = (box) => {
        setEditingId(null);
        if (!stripHtml(box.content).trim()) removeTextBox(pageId, box.id);
    };

    return (
        <div
            className={`absolute inset-0 ${isAddTextTool ? 'cursor-text' : 'pointer-events-none'}`}
            style={{ width: `${width}px`, height: `${height}px` }}
            onClick={handleLayerClick}
        >
            {textBoxes.map((box) => {
                if (!isAddTextTool) {
                    return (
                        <div
                            key={box.id}
                            className='absolute whitespace-pre-wrap break-words leading-[1.3]'
                            dir='auto'
                            style={{
                                left: `${box.x * width}px`,
                                top: `${box.y * height}px`,
                                width: `${box.width * width}px`,
                                fontSize: `${box.fontSize * (zoomLevel / 100)}px`,
                                color: box.color,
                            }}
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{ __html: box.content }}
                        />
                    );
                }

                return (
                    <EditableTextBox
                        key={box.id}
                        box={box}
                        pageWidth={width}
                        pageHeight={height}
                        zoomLevel={zoomLevel}
                        isEditing={editingId === box.id}
                        onFocus={() => setEditingId(box.id)}
                        onBlur={() => handleBlur(box)}
                        onCommitContent={(html) => updateTextBoxContent(pageId, box.id, html)}
                        onMovePosition={(x, y) => moveTextBox(pageId, box.id, x, y)}
                        onUpdateStyle={(patch) => updateTextBoxStyle(pageId, box.id, patch)}
                        onDelete={() => {
                            setEditingId(null);
                            removeTextBox(pageId, box.id);
                        }}
                        onRegisterFormatHandler={setActiveTextFormatHandler}
                    />
                );
            })}
        </div>
    );
};

export default TextBoxLayer;