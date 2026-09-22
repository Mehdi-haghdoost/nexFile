"use client";

import React from 'react';
import FileIcon from '@/components/ui/FileIcon';
import { CloseCircleIcon, EmailIcon, FilesIcon, LinkIcon, UploadIcon } from '@/components/ui/icons';

// How the transfer reaches people: a copyable link or emails sent by NexFile
const TRANSFER_TYPES = [
    { id: 'link', label: 'Link', Icon: LinkIcon },
    { id: 'email', label: 'Email', Icon: EmailIcon },
];

const TransferFilesPanel = ({
    files,
    isDragging,
    dragHandlers,
    onFileSelect,
    onOpenPicker,
    onRemoveFile,
    transferType,
    onTransferTypeChange,
    isBusy = false,
}) => {
    const addButtonClasses = 'flex flex-1 sm:flex-initial justify-center items-center gap-1 sm:gap-1.5 h-8 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg border border-stroke-300 bg-white shadow-light text-xs sm:text-sm font-medium text-neutral-500 dark:text-white transition-all duration-200 hover:border-gray-400 hover:shadow-md active:scale-95 dark:bg-dark-gradient dark:border-dark-border disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <div className='flex flex-col items-start gap-3 sm:gap-4 self-stretch' {...dragHandlers}>
            <div className='flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0 w-full'>
                {/* Link or email delivery */}
                <div className='flex items-center h-8 gap-0.5 sm:gap-1 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100 dark:bg-neutral-900 dark:border-neutral-700'>
                    {TRANSFER_TYPES.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            type='button'
                            onClick={() => onTransferTypeChange(id)}
                            disabled={isBusy}
                            className={`
                                flex flex-1 justify-center items-center py-1 pr-3 sm:pr-4 pl-2 sm:pl-3 gap-1.5 sm:gap-2.5 self-stretch rounded-lg
                                transition-[border,box-shadow,transform,color,opacity] text-xs sm:text-sm font-medium
                                ${transferType === id
                                    ? 'border border-stroke-200 bg-white shadow-middle scale-100 text-neutral-500 dark:text-white dark:border-dark-border dark:bg-dark-gradient'
                                    : 'border border-transparent bg-transparent scale-95 hover:scale-100 text-neutral-500 dark:text-neutral-300'
                                }
                            `}
                        >
                            <Icon />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>

                {/* Add more files from either source */}
                <div className='flex items-center gap-2'>
                    <label className={`${addButtonClasses} cursor-pointer`}>
                        <UploadIcon />
                        <input type="file" multiple onChange={onFileSelect} disabled={isBusy} className='hidden' />
                        <span className="hidden sm:inline">Upload file</span>
                    </label>

                    <button
                        type='button'
                        onClick={onOpenPicker}
                        disabled={isBusy}
                        title='Add from NexFile'
                        className={addButtonClasses}
                    >
                        <FilesIcon />
                        <span className="hidden sm:inline">From NexFile</span>
                    </button>
                </div>
            </div>

            <p className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400'>
                {files.length} {files.length === 1 ? 'file' : 'files'}
            </p>

            <div className={`
                files-list-container flex flex-col gap-2 max-h-[180px] sm:max-h-[200px] overflow-y-auto custom-scrollbar w-full
                ${isDragging ? 'border-2 border-dashed border-primary-500 bg-primary-50 rounded-lg p-2 dark:bg-primary-bg dark:border-primary-border' : ''}
            `}>
                {files.map((file) => (
                    <div
                        key={file.id}
                        className='flex justify-between items-center p-2 sm:p-3 rounded-lg border border-stroke-200 bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 gap-2'
                    >
                        <div className='flex items-center gap-2 self-stretch min-w-0 flex-1'>
                            <FileIcon extension={file.extension} className="shrink-0" />
                            <div className='flex flex-col gap-0.5 sm:gap-1 min-w-0 flex-1'>
                                <p dir="auto" className='text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate'>
                                    {file.name}
                                </p>
                                <p className='text-xs text-gray-500 dark:text-neutral-300'>
                                    {file.source === 'library' ? `${file.size} · From NexFile` : file.size}
                                </p>
                            </div>
                        </div>
                        <button
                            type='button'
                            onClick={() => onRemoveFile(file.id)}
                            disabled={isBusy}
                            aria-label={`Remove ${file.name}`}
                            className='flex justify-center items-center w-4 h-4 shrink-0 hover:opacity-70 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed'
                        >
                            <CloseCircleIcon />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransferFilesPanel;