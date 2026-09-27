"use client";

import React from 'react';
import { FilesIcon, UploadDocumentIcon, UploadIcon } from '@/components/ui/icons';

const TransferDropZone = ({ isDragging, dragHandlers, onFileSelect, onOpenPicker }) => {
    const sourceButtonClasses = 'w-full sm:w-auto flex justify-center items-center gap-1.5 h-9 sm:h-10 py-2 sm:py-3 px-4 sm:px-6 rounded-lg border border-stroke-300 bg-white shadow-light text-xs sm:text-sm font-medium text-neutral-500 dark:text-white transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 dark:bg-dark-gradient dark:border-dark-border';

    return (
        <div className='flex flex-col items-center gap-4 sm:gap-6 self-stretch'>
            <div
                {...dragHandlers}
                className={`
                    flex flex-col justify-center items-center gap-3 sm:gap-4 self-stretch
                    py-8 sm:py-12 px-4 sm:px-6 rounded-lg border-2 border-dashed transition-all duration-200 dark:bg-neutral-900 dark:border-neutral-700
                    ${isDragging
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-bg'
                        : 'border-stroke-300 bg-gray-50'
                    }
                `}
            >
                <div className="rounded-lg bg-gradient-to-t from-[#9B9B9E] to-[#CDCDD1] shadow-[inset_0_-1px_1px_0_rgba(0,0,0,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.40)] flex w-7 h-7 sm:w-8 sm:h-8 p-1 justify-center items-center gap-2 flex-shrink-0 aspect-square dark:bg-dark-neutral-gradient dark:border-dark-white-70">
                    <UploadDocumentIcon size={16} />
                </div>
                <p className='text-xs sm:text-sm text-neutral-400 dark:text-white text-center px-4'>
                    Drag and drop files here to upload
                </p>
            </div>

            {/* Two sources: the local disk or files already in NexFile */}
            <div className='flex flex-col sm:flex-row items-stretch gap-2 w-full sm:w-auto'>
                <label className={`${sourceButtonClasses} cursor-pointer`}>
                    <UploadIcon />
                    <input type="file" multiple onChange={onFileSelect} className='hidden' />
                    Upload file
                </label>

                <button type='button' onClick={onOpenPicker} className={sourceButtonClasses}>
                    <FilesIcon />
                    Add from NexFile
                </button>
            </div>
        </div>
    );
};

export default TransferDropZone;