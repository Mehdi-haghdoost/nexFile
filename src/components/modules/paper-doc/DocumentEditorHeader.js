import { BellIcon, FilePlus01, FolderIcon, SearchIcon, ShareIcon } from '@/components/ui/icons';
import React from 'react';

const DocumentEditorHeader = ({ selectedFolder, onShareClick, onToggleSidebar }) => {
    return (
        <div className='flex items-center justify-between py-3 sm:py-4 md:py-[18px] px-3 sm:px-6 md:px-8 border-b border-[#F2F2F3] dark:border-neutral-800 bg-white dark:bg-neutral-900 self-stretch gap-2 sm:gap-3'>
            {/* Left Section */}
            <div className='flex items-center gap-2 sm:gap-3 flex-1 min-w-0'>
                {/* Hamburger Menu */}
                <button
                    onClick={onToggleSidebar}
                    className='lg:hidden p-1 sm:p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded transition-colors flex-shrink-0'
                    aria-label="Toggle sidebar"
                >
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-500 dark:text-neutral-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Document Info */}
                <div className='flex flex-col justify-center items-start gap-0.5 min-w-0'>
                    <h3 className='text-sm sm:text-base font-medium text-neutral-500 dark:text-white truncate'>Daily Task</h3>
                    <div className='flex items-center gap-1 min-w-0'>
                        <FolderIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <h2 className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 truncate'>
                            {selectedFolder ? selectedFolder.name : 'No folder selected'}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className='flex items-center justify-end gap-2 sm:gap-3 md:gap-4 flex-shrink-0'>
                {/* User Actions */}
                <div className='flex items-center gap-2 sm:gap-3'>
                    {/* Avatar - hidden on small mobile */}
                    <img 
                        src="/images/nav_img.png" 
                        className='hidden sm:block w-6 h-6 sm:w-7 sm:h-7 rounded-full flex-shrink-0' 
                        alt="User avatar" 
                    />
                    
                    {/* Share Button */}
                    <button
                        onClick={onShareClick}
                        className='flex justify-center items-center gap-1.5 sm:gap-2.5 py-2 px-2 sm:py-[13px] sm:pr-4 sm:pl-3 h-8 rounded-lg border border-[#5749BF] shadow-heavy bg-gradient-primary hover:opacity-90 transition-opacity flex-shrink-0'
                    >
                        <ShareIcon className="w-4 h-4" />
                        <span className='hidden sm:inline text-xs sm:text-sm font-medium text-white'>Share</span>
                    </button>
                    
                    {/* New Doc Button - hidden on mobile */}
                    <button className='hidden md:flex justify-center items-center gap-2.5 py-[13px] pr-4 pl-3 h-8 rounded-lg border border-[#ECECEE] bg-white dark:bg-dark-gradient dark:border-dark-border shadow-light dark:shadow-dark-panel hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors'>
                        <FilePlus01 className="w-4 h-4" />
                        <span className='text-sm font-medium text-neutral-500 dark:text-white'>New doc</span>
                    </button>
                </div>

                {/* Divider - hidden on mobile */}
                <svg className='hidden md:block' xmlns="http://www.w3.org/2000/svg" width="2" height="33" viewBox="0 0 2 33" fill="none">
                    <path d="M1 0.5V32.5" stroke="#F1F1F3" className='dark:stroke-[#212127]' />
                </svg>

                {/* Action Buttons - hidden on small mobile */}
                <div className='hidden sm:flex items-center gap-2 sm:gap-3'>
                    <button className='flex w-7 h-7 sm:w-8 sm:h-8 justify-center items-center rounded-lg border border-[#ECECEE] dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light dark:shadow-dark-panel hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex-shrink-0'>
                        <SearchIcon className="w-4 h-4" />
                    </button>
                    <div className='relative'>
                        <button className='flex w-7 h-7 sm:w-8 sm:h-8 justify-center items-center rounded-lg border border-[#ECECEE] dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light dark:shadow-dark-panel hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex-shrink-0'>
                            <BellIcon className="w-4 h-4" />
                        </button>
                        <svg className='absolute -top-0.5 -right-0.5' xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 5 5" fill="none">
                            <circle cx="2.5" cy="2.5" r="2.5" fill="#BC1828" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentEditorHeader;