'use client';
import React, { useState, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { ChevronDownIcon } from '@/components/ui/icons';
import { QUICK_COLORS } from '@/utils/constants/pdfEditorConstants';
import { isValidHexColor, normalizeHexColor } from '@/utils/pdf-editor/color';

export const ToolButton = ({ icon: Icon, label, onClick, isActive = false, disabled = false }) => (
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

export const ToolSection = ({ label, children, hasBorder = false }) => (
    <section className={`flex items-center justify-center gap-1.5 sm:gap-2 ${hasBorder ? 'pr-2 border-r border-stroke-500' : ''}`}>
        {label && <h3 className='hidden sm:block text-xs text-neutral-500 dark:text-white whitespace-nowrap'>{label}</h3>}
        {children}
    </section>
);

export const DropdownButton = ({ value, options, isOpen, onToggle, onSelect, formatValue, dropdownRef }) => (
    <div className='relative' ref={dropdownRef}>
        <button
            onMouseDown={(event) => event.preventDefault()}
            onClick={onToggle}
            className="flex h-7 sm:h-8 py-2 sm:py-[13px] pr-1.5 sm:pr-2 pl-2 sm:pl-[14px] justify-center items-center gap-1 rounded-lg border border-stroke-300 dark:border-neutral-800 bg-white dark:bg-dark-overlay shadow-light hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors flex-shrink-0"
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
                        onMouseDown={(event) => event.preventDefault()}
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

export const ColorPicker = ({ color, onChange, isOpen, onToggle, onQuickSelect, onHexCommit, pickerRef }) => {
    const [hexDraft, setHexDraft] = useState(color);
    const savedRangeRef = useRef(null);

    useEffect(() => {
        setHexDraft(color);
    }, [color]);

    // Typing here requires focusing the input, which blurs the text box and
    // destroys its selection, so the range is snapshotted before that happens.
    const handleHexFocus = () => {
        const selection = window.getSelection();
        savedRangeRef.current =
            selection && selection.rangeCount > 0 && !selection.isCollapsed
                ? selection.getRangeAt(0).cloneRange()
                : null;
    };

    const handleHexChange = (value) => {
        setHexDraft(value);
        if (isValidHexColor(value)) onHexCommit(normalizeHexColor(value), savedRangeRef.current);
    };

    return (
        <div className='relative flex-shrink-0' ref={pickerRef}>
            <button
                onMouseDown={(event) => event.preventDefault()}
                onClick={onToggle}
                className='flex w-7 h-7 sm:w-8 sm:h-8 p-1 justify-center items-center rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors'
                aria-label="Select color"
            >
                <div className='w-full h-full rounded border border-gray-200' style={{ backgroundColor: color }} />
            </button>

            {isOpen && (
                <div className='absolute top-full mt-2 left-0 sm:left-auto sm:right-0 bg-white dark:bg-neutral-900 border border-stroke-300 dark:border-neutral-700 rounded-lg shadow-lg z-50 p-3 sm:p-4'>
                    <div className='mb-3 sm:mb-4'>
                        <h4 className='text-xs text-gray-600 dark:text-gray-300 mb-2'>Quick Colors</h4>
                        <div className='grid grid-cols-5 gap-1'>
                            {QUICK_COLORS.map(({ hex, swatchClass }) => (
                                <button
                                    key={hex}
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => onQuickSelect(hex)}
                                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 hover:scale-110 transition-transform ${swatchClass} ${
                                        color === hex ? 'border-primary-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    title={hex}
                                />
                            ))}
                        </div>
                    </div>

                    <div className='mb-3'>
                        <h4 className='text-xs text-gray-600 dark:text-gray-300 mb-2'>Custom Color</h4>
                        <HexColorPicker
                            color={color}
                            onChange={(value) => onChange(normalizeHexColor(value, color))}
                            className="!w-[180px] !h-[130px] sm:!w-[200px] sm:!h-[150px]"
                        />
                    </div>

                    <div className='flex items-center gap-2'>
                        <input
                            type="text"
                            value={hexDraft}
                            onFocus={handleHexFocus}
                            onChange={(e) => handleHexChange(e.target.value)}
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
};