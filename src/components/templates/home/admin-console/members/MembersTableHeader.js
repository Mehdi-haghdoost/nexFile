const MembersTableHeader = () => {
    return (
        <header className='hidden lg:flex items-center gap-2 min-h-[40px] py-3 px-4 self-stretch border-b border-stroke-300 bg-stroke-50 dark:bg-neutral-800 dark:border-neutral-700'>
            <div className='flex flex-1 items-center gap-3 min-w-0'>
                {/* Name Header */}
                <div className='flex flex-1 items-center gap-2 min-h-[22px] py-0 px-3 min-w-0'>
                    <h3 className='text-sm text-neutral-300 dark:text-neutral-300'>Name</h3>
                </div>
                
                {/* Role Header */}
                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch flex-shrink-0'>
                    <h3 className='text-sm text-neutral-300 dark:text-neutral-300'>Role</h3>
                </div>
                
                {/* Storage Usage Header */}
                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch flex-shrink-0'>
                    <h3 className='text-sm text-neutral-300 dark:text-neutral-300'>Storage usage</h3>
                </div>
                
                {/* Content Permissions Header */}
                <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch flex-shrink-0'>
                    <h3 className='text-sm text-neutral-300 dark:text-neutral-300'>Content permissions</h3>
                </div>
                
                {/* Action Header */}
                <div className='flex items-center justify-center self-stretch w-[52px] py-0 px-3 flex-shrink-0'>
                    <h3 className='text-sm text-neutral-300 dark:text-neutral-300'>Action</h3>
                </div>
            </div>
        </header>
    );
};

export default MembersTableHeader;