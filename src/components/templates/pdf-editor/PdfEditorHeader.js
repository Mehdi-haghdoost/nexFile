'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    CloseIcon,
    EditIcon,
    HelpCircleIcon,
    ChevronDownWhiteIcon,
    ChevronUpWhiteIcon
} from '@/components/ui/icons';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';

const PdfEditorHeader = () => {
    const router = useRouter();
    const { fileName, pdfDoc } = usePdfEditorStore();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    const handleClose = () => {
        router.push('/home');
    };

    return (
        <header className='flex justify-between items-center w-full py-3 px-3 sm:py-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-900 border-b border-stroke-500 dark:border-neutral-800 flex-shrink-0'>
            <button
                onClick={handleClose}
                className='p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded transition-colors flex-shrink-0'
                aria-label="Close PDF editor"
            >
                <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className='flex items-center gap-2 sm:gap-3 flex-1 justify-center min-w-0 px-2'>
                <h1 className='text-sm sm:text-base font-medium text-neutral-500 dark:text-white truncate max-w-[200px] sm:max-w-none'>
                    {fileName || 'Untitled.pdf'}
                </h1>
                <button
                    className='p-1 hover:bg-gray-100 dark:hover:bg-neutral-600 rounded transition-colors flex-shrink-0'
                    aria-label="Edit file name"
                >
                    <EditIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>

            <nav className='flex items-center justify-center gap-2 sm:gap-3'>
                {/* Help button - hidden on mobile */}
                <button
                    className='hidden md:flex justify-center items-center h-8 w-8 rounded-lg border border-stroke-300 bg-white dark:bg-dark-gradient dark:shadow-dark-panel dark:border-dark-border shadow-light hover:bg-gray-50 transition-colors flex-shrink-0'
                    aria-label="Help"
                >
                    <HelpCircleIcon />
                </button>

                {/* Cancel button - hidden on mobile */}
                <button
                    onClick={handleClose}
                    className='hidden sm:flex justify-center items-center h-8 py-2 px-3 sm:px-4 rounded-lg border border-stroke-300 bg-white shadow-light text-xs sm:text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 transition-colors dark:bg-dark-gradient dark:shadow-dark-panel dark:border-dark-border'
                >
                    Cancel
                </button>

                <div className='relative' ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        disabled={!pdfDoc}
                        className='flex justify-center items-center h-8 py-2 px-3 sm:px-4 gap-1 rounded-lg border border-[#5749BF] bg-gradient-primary shadow-heavy text-xs sm:text-sm font-medium text-white hover:opacity-90 transition-opacity flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        Save
                        {isDropdownOpen ? <ChevronUpWhiteIcon className="w-4 h-4" /> : <ChevronDownWhiteIcon className="w-4 h-4" />}
                    </button>
                    {isDropdownOpen && (
                        <div
                            className='absolute top-full right-0 mt-2 z-[60] inline-flex flex-col items-start gap-2 p-2 rounded-lg border border-stroke-200 bg-white shadow-md dark:bg-neutral-900 dark:border-neutral-700 min-w-[140px]'
                            style={{ boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.08)' }}
                        >
                            {/* Both options are wired up once editing can produce a new file */}
                            <button
                                disabled
                                className='flex w-full h-8 py-1.5 px-2 text-left text-xs sm:text-sm text-neutral-500 dark:text-white items-center rounded-md opacity-50 cursor-not-allowed'
                            >
                                Save as copy
                            </button>
                            <button
                                disabled
                                className='flex w-full h-8 py-1.5 px-2 text-left text-xs sm:text-sm text-neutral-500 dark:text-white items-center rounded-md opacity-50 cursor-not-allowed'
                            >
                                Replace original
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default PdfEditorHeader;