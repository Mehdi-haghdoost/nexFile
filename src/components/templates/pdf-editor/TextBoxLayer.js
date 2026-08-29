'use client';
import React, { useState, useRef, useEffect } from 'react';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import usePdfAnnotationsStore from '@/store/features/pdf-editor/pdfAnnotationsStore';

const DEFAULT_BOX_WIDTH_FRACTION = 0.4;

// dir="auto" lets the browser detect Persian vs Latin from the first strong
// character and shape/mirror the textarea's own layout accordingly. This is
// only about on-screen typing; baking the text into the exported PDF still
// needs explicit reshaping (arabic-persian-reshaper + bidi-js) since pdf-lib
// does none of this itself -- that happens at save/export time, not here.
const EditableTextBox = ({ box, pageWidth, pageHeight, zoomLevel, isEditing, onFocus, onChange, onBlur, onDelete }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        const node = textareaRef.current;
        if (!node) return;
        node.style.height = 'auto';
        node.style.height = `${node.scrollHeight}px`;
    }, [box.content]);

    return (
        <div
            className='absolute'
            style={{
                left: `${box.x * pageWidth}px`,
                top: `${box.y * pageHeight}px`,
                width: `${box.width * pageWidth}px`,
            }}
        >
            {isEditing && (
                <button
                    type='button'
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={(event) => {
                        event.stopPropagation();
                        onDelete();
                    }}
                    className='absolute -top-3 -right-3 w-5 h-5 rounded-full bg-white border border-stroke-300 shadow-light flex items-center justify-center text-[10px] text-neutral-500 hover:bg-gray-50 z-10'
                    aria-label='Delete text box'
                >
                    ×
                </button>
            )}
            <textarea
                ref={textareaRef}
                value={box.content}
                dir='auto'
                autoFocus={isEditing}
                onFocus={onFocus}
                onChange={onChange}
                onBlur={onBlur}
                onClick={(event) => event.stopPropagation()}
                placeholder='Type here'
                rows={1}
                style={{
                    width: '100%',
                    fontSize: `${box.fontSize * (zoomLevel / 100)}px`,
                    color: box.color,
                    lineHeight: 1.3,
                    resize: 'none',
                    overflow: 'hidden',
                    background: 'transparent',
                    border: isEditing ? '1px dashed #4C3CC6' : '1px dashed transparent',
                    outline: 'none',
                    padding: 0,
                    fontFamily: 'inherit',
                    display: 'block',
                }}
            />
        </div>
    );
};

const TextBoxLayer = ({ pageNumber, width, height }) => {
    const { activeEditingTool, toolSettingsByTool, zoomLevel } = usePdfEditorStore();
    const { textBoxesByPage, addTextBox, updateTextBoxContent, removeTextBox } = usePdfAnnotationsStore();

    const [editingId, setEditingId] = useState(null);

    const textBoxes = textBoxesByPage[pageNumber] || [];
    const isAddTextTool = activeEditingTool === 'addText';
    const textSettings = toolSettingsByTool.text;

    const handleLayerClick = (event) => {
        if (!isAddTextTool || event.target !== event.currentTarget) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

        addTextBox(pageNumber, {
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
        // An empty box left behind after clicking away is just clutter
        if (!box.content.trim()) removeTextBox(pageNumber, box.id);
    };

    return (
        <div
            className='absolute inset-0'
            style={{
                width: `${width}px`,
                height: `${height}px`,
                pointerEvents: isAddTextTool ? 'auto' : 'none',
                cursor: isAddTextTool ? 'text' : 'default',
            }}
            onClick={handleLayerClick}
        >
            {textBoxes.map((box) => {
                if (!isAddTextTool) {
                    // Read-only outside the Add text tool, matching how
                    // strokes stay visible but not editable while another
                    // tool is active.
                    return (
                        <div
                            key={box.id}
                            className='absolute whitespace-pre-wrap'
                            dir='auto'
                            style={{
                                left: `${box.x * width}px`,
                                top: `${box.y * height}px`,
                                width: `${box.width * width}px`,
                                fontSize: `${box.fontSize * (zoomLevel / 100)}px`,
                                color: box.color,
                                lineHeight: 1.3,
                            }}
                        >
                            {box.content}
                        </div>
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
                        onChange={(event) => updateTextBoxContent(pageNumber, box.id, event.target.value)}
                        onBlur={() => handleBlur(box)}
                        onDelete={() => {
                            setEditingId(null);
                            removeTextBox(pageNumber, box.id);
                        }}
                    />
                );
            })}
        </div>
    );
};

export default TextBoxLayer;