"use client";

import React, { useEffect, useRef, useState } from 'react';
import { CalendarDateIcon } from '@/components/ui/icons';
import { TRANSFER_EXPIRY_OPTIONS } from '@/utils/constants/transferConstants';

const DAY_MS = 24 * 60 * 60 * 1000;

// Formats a preview date as "Sep 28"
const formatShortDate = (date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const TransferExpiryControl = ({ currentExpiration, isExpired, isPending, disabled, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Trigger and panel share one container, so clicking the trigger toggles instead of reopening
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setIsOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    // A live transfer only sees options that push its expiry later, so Extend never shortens it
    const currentTime = new Date(currentExpiration).getTime();
    const options = TRANSFER_EXPIRY_OPTIONS
        .map((option) => ({ ...option, until: new Date(Date.now() + option.days * DAY_MS) }))
        .filter((option) => isExpired || option.until.getTime() > currentTime);

    const handleSelect = (days) => {
        setIsOpen(false);
        onSelect?.(days);
    };

    return (
        <div ref={containerRef} className='relative'>
            <button
                type='button'
                onClick={() => setIsOpen((prev) => !prev)}
                disabled={disabled}
                aria-expanded={isOpen}
                className='flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light dark:shadow-dark-panel text-sm font-medium text-neutral-500 dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed'
            >
                {isPending ? (
                    <div className='w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin' />
                ) : (
                    <CalendarDateIcon />
                )}
                {isExpired ? 'Reactivate' : 'Extend'}
            </button>

            {isOpen && (
                // Anchored left on mobile where the button sits at the left edge, right on wider screens
                <div className='absolute top-full left-0 sm:left-auto sm:right-0 z-50 mt-2 w-64 rounded-xl border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2 shadow-dropdown dark:shadow-dark-dropdown'>
                    <p className='px-2 pt-1 pb-2 text-xs font-medium text-neutral-400 dark:text-neutral-300'>
                        {isExpired ? 'Make the link work again for' : 'Keep the link working for'}
                    </p>

                    {options.length === 0 ? (
                        <p className='px-2 pb-2 text-xs text-neutral-300 dark:text-neutral-400'>
                            This transfer already runs as long as the longest option.
                        </p>
                    ) : (
                        <div className='flex flex-col gap-0.5'>
                            {options.map((option) => (
                                <button
                                    key={option.days}
                                    type='button'
                                    onClick={() => handleSelect(option.days)}
                                    className='flex items-center justify-between rounded-lg px-2 py-2 text-sm text-neutral-500 dark:text-white transition-colors hover:bg-[#F6F6F7] dark:hover:bg-dark-overlay'
                                >
                                    <span>{option.label}</span>
                                    <span className='text-xs text-neutral-300 dark:text-neutral-400'>
                                        until {formatShortDate(option.until)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TransferExpiryControl;