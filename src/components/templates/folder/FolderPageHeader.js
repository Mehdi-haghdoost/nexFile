'use client';

import { useEffect, useRef, useState } from 'react';
import FolderBreadcrumbs from './FolderBreadcrumbs';
import FolderActionMenu from '@/components/modules/home/allFolder/FolderActionMenu';
import { useFolderActions } from '@/hooks/folders/useFolderActions';

const formatBytes = (bytes) => {
    if (!bytes || bytes <= 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

// Summarises the folder beside its name, so the counts are visible without scrolling
const describeContents = (folder) => {
    const parts = [];

    if (folder?.subFoldersCount) {
        parts.push(`${folder.subFoldersCount} ${folder.subFoldersCount === 1 ? 'subfolder' : 'subfolders'}`);
    }

    if (folder?.filesCount) {
        parts.push(`${folder.filesCount} ${folder.filesCount === 1 ? 'file' : 'files'}`);
    }

    parts.push(formatBytes(folder?.totalSize));

    return parts.join(' · ');
};

const FolderPageHeader = ({ folder, path, isLoading, onRenamed }) => {
    const { renameFolder } = useFolderActions();

    const [isRenaming, setIsRenaming] = useState(false);
    const [draftName, setDraftName] = useState('');
    const inputRef = useRef(null);

    // Selects the name on entry, so typing replaces it without clearing first
    useEffect(() => {
        if (isRenaming) inputRef.current?.select();
    }, [isRenaming]);

    const startRenaming = () => {
        setDraftName(folder?.name || '');
        setIsRenaming(true);
    };

    const commitRename = async () => {
        setIsRenaming(false);

        const renamed = await renameFolder(folder, draftName);
        if (renamed) onRenamed?.(draftName.trim());
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') commitRename();
        if (event.key === 'Escape') setIsRenaming(false);
    };

    return (
        <div className='flex flex-col gap-2 w-full'>
            <FolderBreadcrumbs path={path} />

            {isLoading ? (
                <div className='flex flex-col gap-2'>
                    <div className='h-7 w-48 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse' />
                    <div className='h-3 w-32 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse' />
                </div>
            ) : (
                <div className='flex items-start justify-between gap-3'>
                    <div className='flex flex-col gap-1 min-w-0'>
                        {isRenaming ? (
                            <input
                                ref={inputRef}
                                type='text'
                                dir='auto'
                                value={draftName}
                                maxLength={100}
                                onChange={(event) => setDraftName(event.target.value)}
                                onBlur={commitRename}
                                onKeyDown={handleKeyDown}
                                aria-label={`Rename ${folder?.name}`}
                                className='w-full max-w-sm rounded-lg border border-primary-500 bg-white dark:bg-neutral-900 px-2 py-1 text-lg md:text-xl font-medium text-neutral-500 dark:text-white outline-none'
                            />
                        ) : (
                            <h1
                                dir='auto'
                                onDoubleClick={startRenaming}
                                title='Double-click to rename'
                                className='text-lg md:text-xl font-medium text-neutral-500 dark:text-white truncate cursor-text'
                            >
                                {folder?.name}
                            </h1>
                        )}

                        <span className='text-xs text-neutral-300 dark:text-neutral-400'>
                            {describeContents(folder)}
                        </span>
                    </div>

                    {/* The same menu the cards use, minus Open, since this is that folder's page */}
                    {folder && (
                        <div className='shrink-0 pt-1'>
                            <FolderActionMenu
                                folder={folder}
                                onRename={startRenaming}
                                showOpen={false}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FolderPageHeader;