import MemberActionButton from './MemberActionButton';

const MemberItem = ({ member }) => {
    return (
        <li className='flex items-center gap-2 h-[52px] py-[13px] px-3 self-stretch border-b border-stroke-100 last:border-b-0'>
            <div className='flex flex-1 items-center gap-2'>
                {/* Member Name Container */}
                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                    <img
                        className='w-6 h-6 rounded-3xl'
                        src={member.avatar}
                        alt={`${member.name} avatar`}
                    />
                    <h4 className='text-medium-14'>{member.name}</h4>
                </div>
                
                {/* Role Container */}
                <div className='flex flex-1 items-center gap-3 py-0 px-3 self-stretch'>
                    <p className='text-medium-14'>{member.role}</p>
                </div>
                
                {/* Storage Usage */}
                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                    <p className='text-medium-14'>{member.storageUsage}</p>
                </div>
                
                {/* Content Permissions */}
                <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch'>
                    <p className='text-medium-14'>{member.permission}</p>
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