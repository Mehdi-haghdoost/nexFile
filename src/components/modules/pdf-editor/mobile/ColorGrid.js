'use client';
import React, { useState, useEffect } from 'react';
import { QUICK_COLORS } from '@/utils/constants/pdfEditorConstants';
import { isValidHexColor, normalizeHexColor } from '@/utils/pdf-editor/color';

const ColorGrid = ({ value, onSelect }) => {
    const [hexDraft, setHexDraft] = useState(value);

    useEffect(() => {
        setHexDraft(value);
    }, [value]);

    // Commits only once the draft is a complete hex so a half-typed value never lands in the store
    const handleHexChange = (next) => {
        setHexDraft(next);
        if (isValidHexColor(next)) onSelect(normalizeHexColor(next));
    };

    return (
        <div className='flex flex-col gap-2'>
            <span className='text-sm font-medium text-neutral-500 dark:text-white'>Color</span>
            <div className='grid grid-cols-5 gap-2'>
                {QUICK_COLORS.map(({ hex, swatchClass }) => (
                    <button
                        key={hex}
                        onClick={() => onSelect(hex)}
                        className={`h-10 rounded-lg border-2 transition-transform active:scale-95 ${swatchClass} ${
                            value === hex ? 'border-primary-500' : 'border-stroke-300 dark:border-neutral-600'
                        }`}
                        aria-label={`Color ${hex}`}
                    />
                ))}
            </div>
            <div className='flex items-center gap-2'>
                <input
                    type='text'
                    value={hexDraft}
                    onChange={(e) => handleHexChange(e.target.value)}
                    placeholder='#000000'
                    className='flex-1 h-10 px-3 rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm text-neutral-500 dark:text-white text-center outline-none focus:border-primary-500'
                />
                <div
                    className='w-10 h-10 rounded-lg border border-stroke-300 dark:border-neutral-600 flex-shrink-0'
                    style={{ backgroundColor: value }}
                />
            </div>
        </div>
    );
};

export default ColorGrid;