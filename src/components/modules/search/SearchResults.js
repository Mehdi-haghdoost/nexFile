'use client';

import Link from 'next/link';
import FileIcon from '@/components/ui/FileIcon';
import ItemPath from '@/components/modules/folders/ItemPath';
import { FolderIcon2 } from '@/components/ui/icons';

const formatBytes = (bytes) => {
    if (!bytes || bytes <= 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

const SearchResults = ({ results, isSearching, term, onSelect }) => {
    const { folders, files } = results;
    const hasResults = folders.length > 0 || files.length > 0;

    const rowClasses = 'group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-[#F6F6F7] dark:hover:bg-dark-overlay';

    return (
        <div className='absolute left-0 right-0 top-full z-50 mt-2 max-h-[400px] overflow-y-auto custom-scrollbar rounded-xl border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-dropdown dark:shadow-dark-dropdown animate-in fade-in-0 slide-in-from-top-1 duration-200'>
            {isSearching && !hasResults ? (
                <div className='flex justify-center py-8'>
                    <div className='h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent' />
                </div>
            ) : !hasResults ? (
                <p className='px-4 py-8 text-center text-xs text-neutral-300 dark:text-neutral-400'>
                    Nothing matches &ldquo;{term}&rdquo;
                </p>
            ) : (
                <>
                    {folders.length > 0 && (
                        <div className='flex flex-col'>
                            <p className='px-3 pt-3 pb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-300 dark:text-neutral-400'>
                                Folders
                            </p>

                            {folders.map((folder) => (
                                <Link
                                    key={folder.id}
                                    href={`/folder/${folder.id}`}
                                    onClick={onSelect}
                                    className={rowClasses}
                                >
                                    <span className='flex h-5 w-5 shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-110'>
                                        <FolderIcon2 />
                                    </span>

                                    {/* The path tells apart two folders sharing a name */}
                                    <span className='flex flex-1 min-w-0 flex-col'>
                                        <span dir='auto' className='truncate text-sm text-neutral-500 dark:text-white'>
                                            {folder.name}
                                        </span>
                                        <ItemPath path={folder.path} />
                                    </span>

                                    <span className='shrink-0 text-[11px] text-neutral-300 dark:text-neutral-400'>
                                        {folder.filesCount} {folder.filesCount === 1 ? 'file' : 'files'}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {files.length > 0 && (
                        <div className='flex flex-col border-t border-stroke-200 dark:border-neutral-700 first:border-0'>
                            <p className='px-3 pt-3 pb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-300 dark:text-neutral-400'>
                                Files
                            </p>

                            {/* A file opens the folder holding it, since files have no page of their own */}
                            {files.map((file) => (
                                <Link
                                    key={file.id}
                                    href={file.folder ? `/folder/${file.folder}` : '/folder'}
                                    onClick={onSelect}
                                    className={rowClasses}
                                >
                                    <span className='shrink-0 transition-transform duration-200 group-hover:scale-110'>
                                        <FileIcon extension={file.extension} />
                                    </span>

                                    <span className='flex flex-1 min-w-0 flex-col'>
                                        <span dir='auto' className='truncate text-sm text-neutral-500 dark:text-white'>
                                            {file.name}
                                        </span>
                                        <ItemPath path={file.path} />
                                    </span>

                                    <span className='shrink-0 text-[11px] text-neutral-300 dark:text-neutral-400'>
                                        {formatBytes(file.size)}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchResults;