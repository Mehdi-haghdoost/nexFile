import React from 'react';

const ContentManagementTableHeader = ({ onSelectAll, isAllSelected }) => {
    return (
        <header className='flex items-center gap-2 h-[40px] py-[13px] px-4 self-stretch border-b border-stroke-300 bg-stroke-50'>
            <div className='flex flex-1 items-center gap-3 min-w-0'>
                <div className='flex flex-1 items-center gap-2 h-[22px] py-0 px-3 min-w-0'>
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={onSelectAll}
                        className='w-4 h-4 cursor-pointer flex-shrink-0'
                        aria-label="Select all items"
                    />
                    <h3 className='text-regular-14 whitespace-nowrap'>Name</h3>
                </div>

                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch min-w-0'>
                    <h3 className='text-regular-14 whitespace-nowrap'>Shared By</h3>
                </div>

                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch min-w-0'>
                    <h3 className='text-regular-14 whitespace-nowrap'>File Size</h3>
                </div>

                <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch flex-shrink-0'>
                    <h3 className='text-regular-14 whitespace-nowrap'>Last Modified</h3>
                </div>

                <div className='flex items-center justify-center self-stretch w-[52px] py-0 px-3 flex-shrink-0'>
                    <h3 className='text-regular-14 whitespace-nowrap'>Action</h3>
                </div>
            </div>
        </header>
    );
};

export default ContentManagementTableHeader;