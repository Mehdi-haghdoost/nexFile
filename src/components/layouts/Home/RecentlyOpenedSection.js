'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, ChevronRightIcon, RecentFolderIcon } from '@/components/ui/icons';
import { useRecentFolders } from '@/hooks/folders/useRecentFolders';

const RecentlyOpenedSection = () => {
  const { folders, isLoading } = useRecentFolders();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className='flex flex-col items-start self-stretch'>
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        className='flex items-center h-[38px] py-1 px-3 gap-3 self-stretch rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.03)]'
      >
        <span className='shrink-0 transition-transform duration-300'>
          {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </span>
        <h3 className='text-regular-12-upper dark:text-regular-12-upper-neutral-200'>Recently opened</h3>
      </button>

      {isExpanded && (
        <ul className='flex flex-col self-stretch animate-in fade-in-0 slide-in-from-top-1 duration-200'>
          {isLoading ? (
            [...Array(4)].map((_, index) => (
              <li key={index} className='flex h-[38px] items-center py-1 px-3 gap-2'>
                <div className='h-5 w-5 shrink-0 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse' />
                <div className='h-3 flex-1 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse' />
              </li>
            ))
          ) : folders.length === 0 ? (
            <li className='px-3 py-2 text-xs text-neutral-300 dark:text-neutral-400'>
              Folders you work in appear here
            </li>
          ) : (
            folders.map((folder) => (
              <li key={folder.id} className='self-stretch'>
                {/* Matches the menu rows above, so the whole sidebar behaves as one */}
                <Link
                  href={`/folder/${folder.id}`}
                  className='group flex items-center h-[38px] py-1 px-3 gap-2 self-stretch rounded-lg
                    transition-all duration-300 ease-out
                    hover:bg-gray-50 hover:scale-[1.02] hover:shadow-light active:scale-[0.98]
                    dark:hover:bg-[rgba(255,255,255,0.03)]'
                >
                  <div className='flex h-5 w-5 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110'>
                    <RecentFolderIcon />
                  </div>
                  <h3
                    dir='auto'
                    className='flex-1 min-w-0 truncate text-regular-14 dark:text-regular-14-neutral-200 group-hover:dark:text-white transition-colors duration-300'
                  >
                    {folder.name}
                  </h3>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default RecentlyOpenedSection;