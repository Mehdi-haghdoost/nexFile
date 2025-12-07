import React from 'react';
import { ExportIcon, FolderPlusIcon, SearchIcon } from '@/components/ui/icons';
import ContentManagementTabs from './ContentManagementTabs';

const ContentManagementHeader = ({ activeTab, onTabChange }) => {
    return (
        <header className='flex flex-col gap-3 self-stretch w-full'>
            <ContentManagementTabs activeTab={activeTab} onTabChange={onTabChange} />

            <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full gap-3'>
                <div className='flex flex-1 items-center gap-1.5 h-9 sm:h-8 py-2 sm:py-[13px] pr-3 sm:pr-4 pl-3 rounded-lg border border-stroke-200 bg-white shadow-light min-w-0 sm:min-w-[200px] dark:bg-neutral-900 dark:border-neutral-700'>
                    <SearchIcon className="flex-shrink-0" />
                    <input
                        className='flex-1 text-xs sm:text-sm text-neutral-300 dark:text-neutral-200 outline-0 dark:bg-transparent min-w-0'
                        type="search"
                        placeholder="Search content..."
                        aria-label="Search content"
                    />
                </div>
                <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 w-full sm:w-auto'>
                    <button className='flex justify-center items-center gap-1.5 h-9 sm:h-8 py-2 sm:py-[13px] pr-3 sm:pr-4 pl-3 rounded-lg border border-stroke-300 bg-white shadow-light text-xs sm:text-sm font-medium text-neutral-500 dark:text-white whitespace-nowrap hover:bg-gray-50 dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel dark:hover:bg-neutral-800 active:scale-95 transition-all'>
                        <ExportIcon className="flex-shrink-0" />
                        Export
                    </button>
                    <button
                        className='flex justify-center items-center gap-1.5 py-2 sm:py-[13px] px-3 h-9 sm:h-8 rounded-lg border border-[#5749BF] shadow-heavy bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] text-xs sm:text-sm font-medium text-white whitespace-nowrap hover:opacity-90 active:scale-95 transition-all'
                        aria-label="Create new team folder"
                    >
                        <FolderPlusIcon className="flex-shrink-0" />
                        Create team folder
                    </button>
                </div>
            </div>
        </header>
    );
};

export default ContentManagementHeader;