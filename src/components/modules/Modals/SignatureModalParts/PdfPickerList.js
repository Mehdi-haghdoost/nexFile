import React from 'react';

const PdfIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M11.667 1.66669H5.00033C4.55831 1.66669 4.13438 1.84228 3.82182 2.15484C3.50926 2.4674 3.33366 2.89133 3.33366 3.33335V16.6667C3.33366 17.1087 3.50926 17.5326 3.82182 17.8452C4.13438 18.1578 4.55831 18.3334 5.00033 18.3334H15.0003C15.4423 18.3334 15.8663 18.1578 16.1788 17.8452C16.4914 17.5326 16.667 17.1087 16.667 16.6667V6.66669L11.667 1.66669Z"
            stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.667 1.66669V6.66669H16.667" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SelectedIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
        <path d="M16.667 5L7.50033 14.1667L3.33366 10" stroke="#4C3CC6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const PdfPickerList = ({ files, isLoading, selectedId, onSelect }) => {
    if (isLoading) {
        return (
            <div className='flex justify-center py-8'>
                <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (files.length === 0) {
        return (
            <div className='flex flex-col items-center gap-3 py-8'>
                <figure className='w-12 h-12 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z"
                            stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13 2V9H20" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </figure>
                <div className='text-center'>
                    <h3 className='text-sm font-medium text-neutral-500 dark:text-white mb-1'>No PDF files found</h3>
                    <p className='text-xs text-neutral-400 dark:text-neutral-300'>Upload a PDF file to get started</p>
                </div>
            </div>
        );
    }

    return files.map((pdf) => (
        <button
            key={pdf.id}
            type="button"
            onClick={() => onSelect(pdf)}
            className={`flex w-full items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                selectedId === pdf.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-neutral-700'
                    : 'border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700'
            }`}
        >
            <figure className='w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded flex items-center justify-center shrink-0'>
                <PdfIcon />
            </figure>
            <div className='flex-1 min-w-0'>
                <h3 dir='auto' className='text-sm font-medium text-neutral-600 dark:text-white truncate'>
                    {pdf.name}
                </h3>
                {/* The folder is shown because the signed copy is saved beside the original */}
                <p className='text-xs text-neutral-400 dark:text-neutral-300 truncate'>
                    {(pdf.size / 1024 / 1024).toFixed(2)} MB · in {pdf.folderName || 'Home'}
                </p>
            </div>
            {selectedId === pdf.id && <SelectedIcon />}
        </button>
    ));
};

export default PdfPickerList;