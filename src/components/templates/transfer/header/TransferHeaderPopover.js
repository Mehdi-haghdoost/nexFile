"use client";

import React, { useEffect, useRef, useState } from 'react';

const TransferHeaderPopover = ({ label, badgeCount = 0, onOpen, icon, children }) => {
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

    const handleToggle = () => {
        const next = !isOpen;
        setIsOpen(next);
        if (next) onOpen?.();
    };

    return (
        <div ref={containerRef} className='relative'>
            <button
                type='button'
                onClick={handleToggle}
                aria-label={label}
                aria-expanded={isOpen}
                className={`
                    btn-icon relative w-8 h-8 dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel
                    ${isOpen ? 'border-primary-500 dark:border-primary-500' : ''}
                `}
            >
                {icon}

                {/* Only shown when there is something unread, unlike the old permanent dot */}
                {badgeCount > 0 && (
                    <span className='absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#BC1828] px-1 text-[10px] font-medium text-white'>
                        {badgeCount > 9 ? '9+' : badgeCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className='absolute right-0 top-full z-50 mt-2 w-[320px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-dropdown dark:shadow-dark-dropdown'>
                    {children}
                </div>
            )}
        </div>
    );
};

export default TransferHeaderPopover;