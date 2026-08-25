import Link from 'next/link';
import React from 'react';

// Reached only when no file id is present, so there is nothing to edit yet.
const PdfEditorEmptyPage = () => {
    return (
        <div className='flex flex-col items-center justify-center gap-4 h-screen bg-gray-50 dark:bg-neutral-800 px-6'>
            <h1 className='text-lg font-medium text-neutral-500 dark:text-white text-center'>
                No PDF selected
            </h1>
            <p className='text-sm text-neutral-300 dark:text-neutral-200 text-center max-w-sm'>
                Pick a PDF from your files to start editing.
            </p>
            <Link
                href='/home'
                className='flex justify-center items-center h-8 py-2 px-4 rounded-lg border border-[#5749BF] bg-gradient-primary shadow-heavy text-sm font-medium text-white hover:opacity-90 transition-opacity'
            >
                Go to files
            </Link>
        </div>
    );
};

export default PdfEditorEmptyPage;