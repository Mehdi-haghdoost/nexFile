'use client';
import React, { useRef, useEffect, useState } from 'react';
import {
    EraserIcon,
    LinearCloseCircle,
    RedoIcon,
    UndoIcon
} from '@/components/ui/icons';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import usePdfAnnotationsStore from '@/store/features/pdf-editor/pdfAnnotationsStore';
import { OPACITY_OPTIONS, STROKE_OPTIONS } from '@/utils/constants/pdfEditorConstants';
import { ToolButton, ToolSection, DropdownButton, ColorPicker } from './shared/ToolbarControls';

const DrawToolbar = () => {
    const {
        activeEditingTool,
        setActiveEditingTool,
        toolSettingsByTool,
        isEraserActive,
        setToolColor,
        setToolOpacity,
        setToolStrokeWidth,
        toggleEraser,
    } = usePdfEditorStore();

    const { history, redoStack, undo, redo } = usePdfAnnotationsStore();

    const toolKey = activeEditingTool === 'highlight' ? 'highlight' : 'draw';
    const toolSettings = toolSettingsByTool[toolKey];

    const [openDropdown, setOpenDropdown] = useState(null);

    const colorPickerRef = useRef(null);
    const opacityRef = useRef(null);
    const strokeRef = useRef(null);

    useEffect(() => {
        const refs = { color: colorPickerRef, opacity: opacityRef, stroke: strokeRef };

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

    const handleSelect = (setter) => (value) => {
        setter(value);
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
                        color={toolSettings.color}
                        onChange={setToolColor}
                        isOpen={openDropdown === 'color'}
                        onToggle={() => toggleDropdown('color')}
                        onQuickSelect={handleSelect(setToolColor)}
                        pickerRef={colorPickerRef}
                    />
                </ToolSection>

                <ToolSection label="Opacity">
                    <DropdownButton
                        value={toolSettings.opacity}
                        options={OPACITY_OPTIONS}
                        isOpen={openDropdown === 'opacity'}
                        onToggle={() => toggleDropdown('opacity')}
                        onSelect={handleSelect(setToolOpacity)}
                        formatValue={(val) => `${val}%`}
                        dropdownRef={opacityRef}
                    />
                </ToolSection>

                <ToolSection label="Stroke" hasBorder>
                    <DropdownButton
                        value={toolSettings.strokeWidth}
                        options={STROKE_OPTIONS}
                        isOpen={openDropdown === 'stroke'}
                        onToggle={() => toggleDropdown('stroke')}
                        onSelect={handleSelect(setToolStrokeWidth)}
                        formatValue={(val) => `${val}pt`}
                        dropdownRef={strokeRef}
                    />
                </ToolSection>

                <ToolButton
                    icon={EraserIcon}
                    label="Eraser tool"
                    onClick={toggleEraser}
                    isActive={isEraserActive}
                />
            </div>

            <button
                onClick={() => setActiveEditingTool(null)}
                className='flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors self-end sm:self-auto'
                aria-label="Close drawing toolbar"
            >
                <div className='flex items-center justify-center w-4 h-4'>
                    <LinearCloseCircle />
                </div>
                <span className='text-xs sm:text-sm text-neutral-500 dark:text-white'>Close</span>
            </button>
        </nav>
    );
};

export default DrawToolbar;