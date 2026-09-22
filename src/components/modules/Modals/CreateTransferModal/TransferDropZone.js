"use client";

import React from 'react';
import { FilesIcon, UploadIcon } from '@/components/ui/icons';

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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 18 19" fill="none" className="sm:w-[18px] sm:h-[19px]">
                        <path d="M10.5 2.75V5.75C10.5 5.94891 10.579 6.13968 10.7197 6.28033C10.8603 6.42098 11.0511 6.5 11.25 6.5H14.25M10.5 2.75H5.25C4.85218 2.75 4.47064 2.90804 4.18934 3.18934C3.90804 3.47064 3.75 3.85218 3.75 4.25V14.75C3.75 15.1478 3.90804 15.5294 4.18934 15.8107C4.47064 16.092 4.85218 16.25 5.25 16.25H12.75C13.1478 16.25 13.5294 16.092 13.8107 15.8107C14.092 15.5294 14.25 15.1478 14.25 14.75V6.5M10.5 2.75L14.25 6.5M9 8.75V13.25M9 8.75L7.125 10.625M9 8.75L10.875 10.625" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
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