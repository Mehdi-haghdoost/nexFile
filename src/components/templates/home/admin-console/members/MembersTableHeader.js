const MembersTableHeader = () => {
    return (
        <header className='flex items-center gap-2 h-[40px] py-[13px] px-4 self-stretch border-b border-stroke-300 bg-stroke-50'>
            <div className='flex flex-1 items-center gap-3'>
                {/* Name Header */}
                <div className='flex flex-1 items-center gap-2 h-[22px] py-0 px-3'>
                    <h3 className='text-regular-14'>Name</h3>
                </div>
                
                {/* Role Header */}
                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                    <h3 className='text-regular-14'>Role</h3>
                </div>
                
                {/* Storage Usage Header */}
                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                    <h3 className='text-regular-14'>Storage usage</h3>
                </div>
                
                {/* Content Permissions Header */}
                <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch'>
                    <h3 className='text-regular-14'>Content premissions</h3>
                </div>
                
                {/* Action Header */}
                <div className='flex items-center justify-center self-stretch w-[52px] py-0 px-3'>
                    <h3 className='text-regular-14'>Action</h3>
                </div>
            </div>
        </header>
    );
};

export default MembersTableHeader;