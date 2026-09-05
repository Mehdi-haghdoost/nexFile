'use client';
import React, { useRef, useEffect, useState } from 'react';
import { LinearCloseCircle, RedoIcon, UndoIcon } from '@/components/ui/icons';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import usePdfAnnotationsStore from '@/store/features/pdf-editor/pdfAnnotationsStore';
import { FONT_SIZE_OPTIONS } from '@/utils/constants/pdfEditorConstants';
import { ToolButton, ToolSection, DropdownButton, ColorPicker } from './shared/ToolbarControls';

const AddTextToolbar = () => {
    const {
        setActiveEditingTool,
        toolSettingsByTool,
        setToolColor,
        setToolFontSize,
        activeTextFormatHandler,
        lastTextFormatHandler,
    } = usePdfEditorStore();

    const { history, redoStack, undo, redo } = usePdfAnnotationsStore();

    const textSettings = toolSettingsByTool.text;

    const [openDropdown, setOpenDropdown] = useState(null);
    const colorPickerRef = useRef(null);
    const fontSizeRef = useRef(null);

    useEffect(() => {
        const refs = { color: colorPickerRef, fontSize: fontSizeRef };

        const handleClickOutside = (event) => {
            const activeRef = refs[openDropdown];
            if (activeRef?.current && !activeRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };

        if (openDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdown]);

    const toggleDropdown = (name) => {
        setOpenDropdown((prev) => (prev === name ? null : name));
    };

    // Swatches keep the box focused via preventDefault, so the live handler is still registered
    const handleQuickColorSelect = (color) => {
        if (activeTextFormatHandler) activeTextFormatHandler({ color });
        else setToolColor(color);
        setOpenDropdown(null);
    };

    // The hex input had to take focus to be typed in, so it uses the handler
    // and range captured just before that focus stole them.
    const handleHexCommit = (color, savedRange) => {
        const handler = activeTextFormatHandler || lastTextFormatHandler;
        if (handler && savedRange) handler({ color }, savedRange);
        else setToolColor(color);
    };

    const handleFontSizeSelect = (fontSize) => {
        if (activeTextFormatHandler) activeTextFormatHandler({ fontSize });
        else setToolFontSize(fontSize);
        setOpenDropdown(null);
    };

    return (
        <nav className='flex flex-col sm:flex-row items-start sm:items-center justify-between self-stretch py-3 sm:py-4 px-3 sm:px-8 gap-3 sm:gap-0 border-t border-b border-l border-stroke-200 bg-white dark:bg-neutral-900 dark:border-neutral-700'>
            <div className='flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap pb-2 sm:pb-0'>
                <ToolSection hasBorder>
                    <ToolButton icon={UndoIcon} label="Undo" onClick={undo} disabled={history.length === 0} />
                    <ToolButton icon={RedoIcon} label="Redo" onClick={redo} disabled={redoStack.length === 0} />
                </ToolSection>

                <ToolSection label="Color" hasBorder>
                    <ColorPicker
                        color={textSettings.color}
                        onChange={setToolColor}
                        isOpen={openDropdown === 'color'}
                        onToggle={() => toggleDropdown('color')}
                        onQuickSelect={handleQuickColorSelect}
                        onHexCommit={handleHexCommit}
                        pickerRef={colorPickerRef}
                    />
                </ToolSection>

                <ToolSection label="Size">
                    <DropdownButton
                        value={textSettings.fontSize}
                        options={FONT_SIZE_OPTIONS}
                        isOpen={openDropdown === 'fontSize'}
                        onToggle={() => toggleDropdown('fontSize')}
                        onSelect={handleFontSizeSelect}
                        formatValue={(val) => `${val}px`}
                        dropdownRef={fontSizeRef}
                    />
                </ToolSection>
            </div>

            <button
                onClick={() => setActiveEditingTool(null)}
                className='flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors self-end sm:self-auto'
                aria-label="Close text toolbar"
            >
                <div className='flex items-center justify-center w-4 h-4'>
                    <LinearCloseCircle />
                </div>
                <span className='text-xs sm:text-sm text-neutral-500 dark:text-white'>Close</span>
            </button>
        </nav>
    );
};

export default AddTextToolbar;