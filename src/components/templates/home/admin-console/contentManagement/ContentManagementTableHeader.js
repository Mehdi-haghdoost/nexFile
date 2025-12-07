import React from 'react';

const ContentManagementTableHeader = ({ onSelectAll, isAllSelected }) => {
    return (
        <header className='hidden md:flex items-center gap-2 min-h-[40px] py-3 px-4 self-stretch border-b border-stroke-300 bg-stroke-50 dark:bg-neutral-800 dark:border-neutral-700'>
            <div className='flex flex-1 items-center gap-3 min-w-0'>
                <div className='flex flex-1 items-center gap-2 min-h-[22px] py-0 px-3 min-w-0'>
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={onSelectAll}
                        className="h-[18px] w-[18px] rounded-[4px] border-[#EAEAEB] text-blue-600 focus:ring-blue-500 focus:ring-offset-0 dark:invert dark:hue-rotate-180 dark:brightness-75 dark:accent-white flex-shrink-0 cursor-pointer"
                        aria-label="Select all items"
                    />
                    <h3 className='text-sm text-neutral-300 dark:text-neutral-300 whitespace-nowrap'>Name</h3>
                </div>

                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch min-w-0 flex-shrink-0'>
                    <h3 className='text-sm text-neutral-300 dark:text-neutral-300 whitespace-nowrap'>Shared By</h3>
                </div>

                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch min-w-0 flex-shrink-0'>
                    <h3 className='text-sm text-neutral-300 dark:text-neutral-300 whitespace-nowrap'>File Size</h3>
                </div>

                <div className='flex items-center gap-2 w-[140px] md:w-[180px] py-0 px-3 self-stretch flex-shrink-0'>
                    <h3 className='text-sm text-neutral-300 dark:text-neutral-300 whitespace-nowrap'>Last Modified</h3>
                </div>

                <div className='flex items-center justify-center self-stretch w-[52px] py-0 px-3 flex-shrink-0'>
                    <h3 className='text-sm text-neutral-300 dark:text-neutral-300 whitespace-nowrap'>Action</h3>
                </div>
            </div>
        </header>
    );
};

export default ContentManagementTableHeader;