'use client';
import React, { useState } from 'react';
import {
    CloseIcon,
    EditIcon,
    HelpCircleIcon,
    ChevronDownWhiteIcon,
    ChevronUpWhiteIcon // Added import for up arrow icon
} from '@/components/ui/icons';

const PdfEditorHeader = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleClose = () => {
        console.log('Closing PDF editor');
    };

    // Toggles the dropdown's state
    const handleSaveClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleReplaceOriginal = () => {
        console.log('handleReplaceOriginal');
        setIsDropdownOpen(false); // Close dropdown after selection
    };

    const handleCancel = () => {
        console.log('Canceling changes');
    };

    const handleHelp = () => {
        console.log('Opening help');
    };

    const handleSaveAsCopy = () => {
        console.log('handleSaveAsCopy');
        setIsDropdownOpen(false); // Close dropdown after selection
    };

    return (
        <header className='flex justify-between items-center w-full py-4 px-8 bg-white border-b border-stroke-500'>
            <button
                onClick={handleClose}
                className='p-1 hover:bg-gray-100 rounded transition-colors'
                aria-label="Close PDF editor"
            >
                <CloseIcon />
            </button>

            <div className='flex items-center gap-3'>
                <h1 className='text-medium-16'>File.pdf</h1>
                <button
                    className='p-1 hover:bg-gray-100 rounded transition-colors'
                    aria-label="Edit file name"
                >
                    <EditIcon />
                </button>
            </div>

            <nav className='flex items-center justify-center gap-3'>
                <button
                    onClick={handleHelp}
                    className='flex justify-center items-center h-8 w-8 py-[13px] gap-1.5 rounded-lg border border-stroke-300 bg-white shadow-light hover:bg-gray-50 transition-colors'
                    aria-label="Help"
                >
                    <HelpCircleIcon />
                </button>

                <button
                    onClick={handleCancel}
                    className='flex justify-center items-center h-8 py-[13px] px-[14px] gap-1.5 rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 hover:bg-gray-50 transition-colors'
                >
                    Cancel
                </button>

                <div className='relative'>
                    <button
                        onClick={handleSaveClick}
                        className='flex justify-center items-center h-8 py-[13px] px-[14px] gap-1.5 rounded-lg border border-[#5749BF] bg-gradient-primary shadow-heavy text-medium-14-white hover:opacity-90 transition-opacity'
                    >
                        Save
                        {isDropdownOpen ? <ChevronUpWhiteIcon /> : <ChevronDownWhiteIcon />}
                    </button>
                    {isDropdownOpen && (
                        <div
                            className='absolute top-full right-0 mt-2 z-10 inline-flex flex-col items-start gap-4 p-2 rounded-lg border border-stroke-200 bg-white shadow-md' // The extra character was removed here
                            style={{ boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.08)' }}
                        >
                            <div className='flex flex-col items-start gap-2 px-2 w-full '>
                                <button
                                    onClick={handleSaveAsCopy}
                                    className='flex w-[117px] h-[32px] py-[6px] px-2 text-center text-regular-14  items-center gap-3 rounded-[6.641px] bg-white/8 text-gray-700 hover:bg-gray-100 transition-colors'
                                >
                                    Save as copy
                                </button>
                                <button
                                    onClick={handleReplaceOriginal}
                                    className='flex items-center gap-3 w-[117px] px-1 text-regular-14 h-8 py-[6px]  text-gray-700 hover:bg-gray-100 transition-colors'
                                >
                                    Replace original
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default PdfEditorHeader;