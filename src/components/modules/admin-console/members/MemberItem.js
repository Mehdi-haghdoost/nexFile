import MemberActionButton from './MemberActionButton';

const MemberItem = ({ member }) => {
    return (
        <li className='flex items-center gap-3 px-3 py-2 self-stretch border-b border-stroke-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-custom hover:-translate-y-0.5 cursor-pointer group'>
            <div className='flex flex-1 items-center gap-3'>
                {/* Member Name Container */}
                <div className='flex flex-1 items-center h-[22px] py-0 px-3'>
                    <img
                        className='w-6 h-6 rounded-3xl'
                        src={member.avatar}
                        alt={`${member.name} avatar`}
                    />
                    <h4 className='text-regular-14 ml-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300'>{member.name}</h4>
                </div>
                
                {/* Role Container */}
                <div className='flex flex-1 items-center gap-3 py-0 px-3 self-stretch'>
                    <p className='text-regular-14 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300'>{member.role}</p>
                </div>
                
                {/* Storage Usage */}
                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                    <p className='text-regular-14 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300'>{member.storageUsage}</p>
                </div>
                
                {/* Content Permissions */}
                <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch'>
                    <p className='text-regular-14 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300'>{member.permission}</p>
                </div>
                
                {/* Action Button */}
                <div className='flex justify-center items-center gap-2 w-[52px] py-0 px-3'>
                    <MemberActionButton memberId={member.id} />
                </div>
            </div>
        </li>
    );
};

export default MemberItem;