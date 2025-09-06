import React from 'react';
import { 
    CloseIcon, 
    EditIcon, 
    HelpCircleIcon, 
    ChevronDownWhiteIcon 
} from '@/components/ui/icons';

const PdfEditorHeader = () => {
    const handleClose = () => {
        // Handle close functionality
        console.log('Closing PDF editor');
    };

    const handleSave = () => {
        // Handle save functionality
        console.log('Saving PDF');
    };

    const handleCancel = () => {
        // Handle cancel functionality  
        console.log('Canceling changes');
    };

    const handleHelp = () => {
        // Handle help functionality
        console.log('Opening help');
    };

    return (
        <header className='flex justify-between items-center w-full py-4 px-8 bg-white border-b border-stroke-500'>
            {/* Close Button */}
            <button 
                onClick={handleClose}
                className='p-1 hover:bg-gray-100 rounded transition-colors'
                aria-label="Close PDF editor"
            >
                <CloseIcon />
            </button>

            {/* File Info */}
            <div className='flex items-center gap-3'>
                <h1 className='text-medium-16'>File.pdf</h1>
                <button 
                    className='p-1 hover:bg-gray-100 rounded transition-colors'
                    aria-label="Edit file name"
                >
                    <EditIcon />
                </button>
            </div>

            {/* Action Buttons */}
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
                
                <button 
                    onClick={handleSave}
                    className='flex justify-center items-center h-8 py-[13px] px-[14px] gap-1.5 rounded-lg border border-[#5749BF] bg-gradient-primary shadow-heavy text-medium-14-white hover:opacity-90 transition-opacity'
                >
                    Save
                    <ChevronDownWhiteIcon />
                </button>
            </nav>
        </header>
    );
};

export default PdfEditorHeader;