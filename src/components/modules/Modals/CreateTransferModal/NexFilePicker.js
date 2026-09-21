"use client";

import React, { useMemo, useState } from 'react';
import FileIcon from '@/components/ui/FileIcon';
import { SearchIcon } from '@/components/ui/icons';
import { useFolders } from '@/hooks/files/createFileModal/useFolders';
import { useTransferSources } from '@/hooks/transfers/useTransferSources';
import { formatBytes } from '@/utils/transfers/formatBytes';

const NexFilePicker = ({ addedFileIds = [], onAdd, onCancel }) => {
    const { folders = [] } = useFolders();

    const [folderId, setFolderId] = useState('');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState({});

    const { files, isLoading } = useTransferSources({ folderId, search });

    // Files already in the transfer stay visible but cannot be picked twice
    const addedSet = useMemo(() => new Set(addedFileIds), [addedFileIds]);

    const selectedFiles = Object.values(selected);

    // Selection is keyed by id so it survives switching folders or searching
    const toggleFile = (file) => {
        if (addedSet.has(file.id)) return;

        setSelected((prev) => {
            const next = { ...prev };
            if (next[file.id]) {
                delete next[file.id];
            } else {
                next[file.id] = file;
            }
            return next;
        });
    };

    const handleAdd = () => {
        if (!selectedFiles.length) return;
        onAdd?.(selectedFiles);
    };

    return (
        <div className='flex flex-col gap-3 animate-in fade-in-0 slide-in-from-right-5 duration-300'>
            {/* Search and folder filter */}
            <div className='flex flex-col sm:flex-row gap-2'>
                <div className='flex items-center gap-2 h-9 flex-1 px-3 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-neutral-900 focus-within:border-primary-500'>
                    <SearchIcon />
                    <input
                        type='text'
                        dir='auto'
                        value={search}
                        placeholder='Search your files'
                        onChange={(event) => setSearch(event.target.value)}
                        className='flex-1 min-w-0 bg-transparent text-sm text-neutral-500 dark:text-white outline-none'
                    />
                </div>

                <select
                    value={folderId}
                    onChange={(event) => setFolderId(event.target.value)}
                    className='h-9 sm:w-44 px-3 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-neutral-900 text-sm text-neutral-500 dark:text-white outline-none focus:border-primary-500'
                >
                    <option value=''>All files</option>
                    <option value='root'>Not in a folder</option>
                    {folders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                            {folder.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* File list */}
            <div className='flex flex-col gap-1.5 max-h-[260px] overflow-y-auto custom-scrollbar'>
                {isLoading ? (
                    <div className='flex justify-center py-10'>
                        <div className='w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin' />
                    </div>
                ) : files.length === 0 ? (
                    <p className='py-10 text-center text-sm text-neutral-300 dark:text-neutral-400'>
                        No files here that can be transferred
                    </p>
                ) : (
                    files.map((file) => {
                        const isAdded = addedSet.has(file.id);
                        const isChecked = isAdded || Boolean(selected[file.id]);

                        return (
                            <label
                                key={file.id}
                                className={`
                                    flex items-center gap-3 p-2.5 rounded-lg border transition-colors
                                    ${isAdded ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-primary-500'}
                                    ${isChecked && !isAdded
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-bg'
                                        : 'border-stroke-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900'
                                    }
                                `}
                            >
                                <input
                                    type='checkbox'
                                    checked={isChecked}
                                    disabled={isAdded}
                                    onChange={() => toggleFile(file)}
                                    className='w-4 h-4 shrink-0 accent-primary-500'
                                />
                                <FileIcon extension={file.extension} />
                                <div className='flex flex-col min-w-0 flex-1'>
                                    <p dir='auto' className='text-sm font-medium text-neutral-500 dark:text-white truncate'>
                                        {file.name}
                                    </p>
                                    <p className='text-xs text-neutral-300 dark:text-neutral-400'>
                                        {isAdded ? 'Already added' : formatBytes(file.size)}
                                    </p>
                                </div>
                            </label>
                        );
                    })
                )}
            </div>

            {/* Actions */}
            <div className='flex justify-end gap-2 pt-1'>
                <button
                    type='button'
                    onClick={onCancel}
                    className='h-9 px-4 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors'
                >
                    Back
                </button>
                <button
                    type='button'
                    onClick={handleAdd}
                    disabled={!selectedFiles.length}
                    className='h-9 px-4 rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] text-sm font-medium text-white shadow-light transition-all duration-200 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'
                >
                    {selectedFiles.length
                        ? `Add ${selectedFiles.length} ${selectedFiles.length === 1 ? 'file' : 'files'}`
                        : 'Add files'}
                </button>
            </div>
        </div>
    );
};

export default NexFilePicker;