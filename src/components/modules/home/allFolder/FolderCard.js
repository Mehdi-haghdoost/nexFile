'use client'

import Link from 'next/link';
import FolderActionMenu from './FolderActionMenu';

// Summarises what is inside without needing the folder to be opened
const describeContents = (folder) => {
    const parts = [];

    if (folder.subFoldersCount) {
        parts.push(`${folder.subFoldersCount} ${folder.subFoldersCount === 1 ? 'folder' : 'folders'}`);
    }

    if (folder.filesCount) {
        parts.push(`${folder.filesCount} ${folder.filesCount === 1 ? 'file' : 'files'}`);
    }

    return parts.join(' · ') || 'Empty';
};

const FolderCard = ({ folder }) => {
    if (!folder?.id) return null;

    return (
        <div className='group relative flex w-full items-center gap-1.5 sm:gap-2 rounded-lg border border-[#ECECEE] bg-[#FCFCFC] dark:bg-neutral-800 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 hover:border-primary-200 dark:hover:border-primary-500/30 transition-colors'>
            {/* A real link, so the folder opens in a new tab and is reachable by keyboard */}
            <Link
                href={`/folder/${folder.id}`}
                className='flex flex-1 min-w-0 items-center gap-1.5 sm:gap-2 py-2 pl-2 sm:pl-3 pr-1'
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 sm:w-4 sm:h-4">
                    <path d="M14.6667 7.33337V11.3334C14.6667 14 14 14.6667 11.3333 14.6667H4.66668C2.00001 14.6667 1.33334 14 1.33334 11.3334V4.66671C1.33334 2.00004 2.00001 1.33337 4.66668 1.33337H5.66668C6.66668 1.33337 6.88668 1.62671 7.26668 2.13337L8.26668 3.46671C8.52001 3.80004 8.66668 4.00004 9.33334 4.00004H11.3333C14 4.00004 14.6667 4.66671 14.6667 7.33337Z" stroke="#FFCA28" strokeWidth="1.2" strokeMiterlimit="10" />
                    <path d="M5.33334 1.33337H11.3333C12.6667 1.33337 13.3333 2.00004 13.3333 3.33337V4.25337" stroke="#FFCA28" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <span className='flex flex-1 min-w-0 flex-col'>
                    <span dir='auto' className='text-xs sm:text-sm font-normal text-neutral-500 dark:text-white truncate'>
                        {folder.name}
                    </span>
                    <span className='text-[11px] text-neutral-300 dark:text-neutral-400 truncate'>
                        {describeContents(folder)}
                    </span>
                </span>
            </Link>

            <div className='shrink-0 pr-2 sm:pr-3'>
                <FolderActionMenu folder={folder} />
            </div>
        </div>
    );
};

export default FolderCard;