import React from 'react';
import { ExportIcon, FolderPlusIcon, SearchIcon } from '@/components/ui/icons';
import ContentManagementTabs from './ContentManagementTabs';

const ContentManagementHeader = ({ activeTab, onTabChange }) => {
    return (
        <header className='flex flex-wrap justify-between items-start self-stretch gap-3'>
            <ContentManagementTabs activeTab={activeTab} onTabChange={onTabChange} />

            <div className='flex items-center justify-between w-full gap-3 flex-shrink-0'>
                <div className='flex flex-1 items-center gap-1.5 h-8 py-[13px] pr-4 pl-3 rounded-lg border border-stroke-200 bg-white shadow-light min-w-[200px]'>
                    <SearchIcon />
                    <input
                        className='flex-1 text-regular-12-manrope outline-0 '
                        type="search"
                        placeholder="Search members..."
                        aria-label="Search members"
                    />
                </div>
                <div className='flex items-center justify-center gap-2'>
                    <button className='flex justify-center items-center gap-1.5 h-8 py-[13px] pr-4 pl-3 rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 whitespace-nowrap'>
                        <ExportIcon />
                        Export
                    </button>
                    <button
                        className='flex justify-center items-center gap-1.5 py-[13px] px-3 h-8 rounded-lg border border-[#5749BF] shadow-heavy bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] text-medium-14-white text-sm whitespace-nowrap hover:opacity-90 transition-opacity'
                        aria-label="Create new team folder"
                    >
                        <FolderPlusIcon />
                        Create team folder
                    </button>
                </div>
            </div>
        </header>
    );
};

export default ContentManagementHeader;