'use client';
import React, { useRef, useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import {
    ChevronDownIcon,
    EraserIcon,
    LinearCloseCircle,
    RedoIcon,
    UndoIcon
} from '@/components/ui/icons';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import usePdfAnnotationsStore from '@/store/features/pdf-editor/pdfAnnotationsStore';

const OPACITY_OPTIONS = [25, 50, 75, 100];
const STROKE_OPTIONS = [0.5, 1, 2, 3, 4, 5];
const QUICK_COLORS = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
];

const ToolButton = ({ icon: Icon, label, onClick, isActive = false, disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`p-1.5 sm:p-2 rounded transition-colors flex-shrink-0 ${
            isActive ? 'bg-gray-100 dark:bg-neutral-600' : 'hover:bg-gray-100 dark:hover:bg-transparent'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        aria-label={label}
        title={label}
    >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
);

const ToolSection = ({ label, children, hasBorder = false }) => (
    <section className={`flex items-center justify-center gap-1.5 sm:gap-2 ${hasBorder ? 'pr-2 border-r border-stroke-500' : ''}`}>
        {label && <h3 className='hidden sm:block text-xs text-neutral-500 dark:text-white whitespace-nowrap'>{label}</h3>}
        {children}
    </section>
);

const DropdownButton = ({ value, options, isOpen, onToggle, onSelect, formatValue, dropdownRef }) => (
    <div className='relative' ref={dropdownRef}>
        <button
            onClick={onToggle}
            className="flex h-7 sm:h-8 py-2 sm:py-[13px] pr-1.5 sm:pr-2 pl-2 sm:pl-[14px] justify-center items-center gap-1 rounded-lg border border-stroke-300 dark:border-neutral-800 bg-white dark:bg-dark-overlay shadow-light hover:bg-gray-50 transition-colors flex-shrink-0"
        >
            <span className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white text-center whitespace-nowrap'>
                {formatValue(value)}
            </span>
            <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>

        {isOpen && (
            <div className='absolute top-full mt-1 left-0 bg-white dark:bg-neutral-900 border border-stroke-300 dark:border-dark-border rounded-lg shadow-lg z-50 min-w-[80px]'>
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => onSelect(option)}
                        className={`w-full px-3 py-2 text-left text-xs sm:text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-600 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                            option === value ? 'bg-primary-500/10 dark:bg-transparent text-primary-500' : ''
                        }`}
                    >
                        {formatValue(option)}
                    </button>
                ))}
            </div>
        )}
    </div>
);

const ColorPicker = ({ color, onChange, isOpen, onToggle, onQuickSelect, pickerRef }) => (
    <div className='relative flex-shrink-0' ref={pickerRef}>
        <button
            onClick={onToggle}
            className='flex w-7 h-7 sm:w-8 sm:h-8 p-1 justify-center items-center rounded-lg border border-stroke-300 bg-white dark:bg-neutral-900 dark:border-neutral-700 hover:bg-gray-50 transition-colors'
            aria-label="Select color"
        >
            <div className='w-full h-full rounded border border-gray-200' style={{ backgroundColor: color }} />
        </button>

        {isOpen && (
            <div className='absolute top-full mt-2 left-0 sm:left-auto sm:right-0 bg-white dark:bg-neutral-900 border border-stroke-300 dark:border-neutral-700 rounded-lg shadow-lg z-50 p-3 sm:p-4'>
                <div className='mb-3 sm:mb-4'>
                    <h4 className='text-xs text-gray-600 dark:text-gray-300 mb-2'>Quick Colors</h4>
                    <div className='grid grid-cols-5 gap-1'>
                        {QUICK_COLORS.map((quickColor) => (
                            <button
                                key={quickColor}
                                onClick={() => onQuickSelect(quickColor)}
                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 hover:scale-110 transition-transform ${
                                    color === quickColor ? 'border-primary-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                                style={{ backgroundColor: quickColor }}
                                title={quickColor}
                            />
                        ))}
                    </div>
                </div>

                <div className='mb-3'>
                    <h4 className='text-xs text-gray-600 dark:text-gray-300 mb-2'>Custom Color</h4>
                    <HexColorPicker
                        color={color}
                        onChange={onChange}
                        style={{ width: '180px', height: '130px' }}
                        className="sm:!w-[200px] sm:!h-[150px]"
                    />
                </div>

                <div className='flex items-center gap-2'>
                    <input
                        type="text"
                        value={color}
                        onChange={(e) => onChange(e.target.value)}
                        className='flex-1 px-2 py-1 text-xs border border-stroke-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white rounded text-center'
                        placeholder="#000000"
                    />
                    <div
                        className='w-5 h-5 sm:w-6 sm:h-6 rounded border border-gray-300 dark:border-gray-600 flex-shrink-0'
                        style={{ backgroundColor: color }}
                    />
                </div>
            </div>
        )}
    </div>
);

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
            <div className='flex items-center gap-2 sm:gap-3 w-full sm:w-auto pb-2 sm:pb-0'>
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