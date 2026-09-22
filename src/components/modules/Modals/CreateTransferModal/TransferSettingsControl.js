"use client";

import React, { useEffect, useRef, useState } from 'react';
import { SettingsIcon } from '@/components/ui/icons';
import TransferSettingsPopover from './TransferSettingsPopover';

const TransferSettingsControl = ({ disabled = false, ...settingsProps }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Trigger and popover share one container, so clicking the trigger toggles instead of reopening
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

    // Closes the popover once a transfer starts so settings cannot change mid-request
    useEffect(() => {
        if (disabled) setIsOpen(false);
    }, [disabled]);

    return (
        <div ref={containerRef} className='relative shrink-0'>
            <button
                type='button'
                onClick={() => setIsOpen((prev) => !prev)}
                disabled={disabled}
                title='Transfer settings'
                aria-label='Transfer settings'
                aria-expanded={isOpen}
                className={`
                    flex justify-center items-center w-8 h-8 rounded-lg border bg-white shadow-light transition-colors dark:bg-dark-gradient
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${isOpen
                        ? 'border-primary-500 dark:border-primary-500'
                        : 'border-[#ECECEE] dark:border-dark-border hover:bg-gray-50'
                    }
                `}
            >
                <SettingsIcon />
            </button>

            {isOpen && <TransferSettingsPopover {...settingsProps} />}
        </div>
    );
};

export default TransferSettingsControl;