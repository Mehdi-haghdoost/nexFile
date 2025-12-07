import MemberActionButton from './MemberActionButton';

const MemberItem = ({ member }) => {
    return (
        <>
            {/* Desktop View */}
            <li className='hidden lg:flex items-center gap-3 px-3 py-3 self-stretch border-b border-stroke-300 dark:border-neutral-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group'>
                <div className='flex flex-1 items-center gap-3 min-w-0'>
                    {/* Member Name */}
                    <div className='flex flex-1 items-center min-h-[22px] py-0 px-3 gap-2 min-w-0'>
                        <img
                            className='w-6 h-6 rounded-full flex-shrink-0'
                            src={member.avatar}
                            alt={`${member.name} avatar`}
                        />
                        <h4 className='text-sm text-neutral-300 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate'>{member.name}</h4>
                    </div>
                    
                    {/* Role */}
                    <div className='flex flex-1 items-center gap-3 py-0 px-3 self-stretch flex-shrink-0'>
                        <p className='text-sm text-neutral-300 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors'>{member.role}</p>
                    </div>
                    
                    {/* Storage Usage */}
                    <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch flex-shrink-0'>
                        <p className='text-sm text-neutral-300 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors'>{member.storageUsage}</p>
                    </div>
                    
                    {/* Permissions */}
                    <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch flex-shrink-0'>
                        <p className='text-sm text-neutral-300 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors'>{member.permission}</p>
                    </div>
                    
                    {/* Action */}
                    <div className='flex justify-center items-center gap-2 w-[52px] py-0 px-3 flex-shrink-0'>
                        <MemberActionButton memberId={member.id} />
                    </div>
                </div>
            </li>

            {/* Mobile Card View */}
            <li className='flex lg:hidden flex-col gap-3 p-3 border-b border-stroke-300 dark:border-neutral-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors'>
                <div className='flex items-center justify-between gap-2 w-full'>
                    <div className='flex items-center gap-2 flex-1 min-w-0'>
                        <img
                            className='w-8 h-8 rounded-full flex-shrink-0'
                            src={member.avatar}
                            alt={`${member.name} avatar`}
                        />
                        <div className='flex flex-col gap-0.5 flex-1 min-w-0'>
                            <h4 className='text-sm font-medium text-neutral-500 dark:text-white truncate'>{member.name}</h4>
                            <span className='text-xs text-neutral-300 dark:text-neutral-300'>{member.role}</span>
                        </div>
                    </div>
                    <MemberActionButton memberId={member.id} />
                </div>
                
                <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-400 dark:text-neutral-300 pl-10'>
                    <div className='flex items-center gap-1'>
                        <span className='text-neutral-200 dark:text-neutral-400'>Storage:</span>
                        <span>{member.storageUsage}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <span className='text-neutral-200 dark:text-neutral-400'>Access:</span>
                        <span>{member.permission}</span>
                    </div>
                </div>
            </li>
        </>
    );
};

export default MemberItem;