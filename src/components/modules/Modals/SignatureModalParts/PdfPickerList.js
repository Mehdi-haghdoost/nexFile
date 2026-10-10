import React from 'react';
import { PdfIcon, CheckIcon } from '@/components/ui/icons';

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
            {/* Solid badge, since PdfIcon is drawn with a white stroke */}
            <figure className='w-10 h-10 bg-red-500 rounded flex items-center justify-center shrink-0'>
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
            {selectedId === pdf.id && (
                <span className='w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shrink-0'>
                    <CheckIcon size={14} />
                </span>
            )}
        </button>
    ));
};

export default PdfPickerList;