import { DesignerIcon } from "@/components/ui/icons";
import GroupActionButton from './GroupActionButton';

const GroupItem = ({ group }) => {
    return (
        <li className='flex items-center gap-3 px-3 py-2 self-stretch border-b border-stroke-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-custom hover:-translate-y-0.5 cursor-pointer group'>
            <div className='flex flex-1 items-center gap-3'>
                {/* Group Name Container */}
                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                    <div 
                        className={`flex justify-center items-center gap-2 p-1 h-6 w-6 rounded bg-gradient-to-b ${group.icon.gradient} shadow-[inset_0_-1px_1px_0_rgba(0,0,0,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.40)] aspect-square`}
                        aria-hidden="true"
                    >
                        <DesignerIcon />
                    </div>
                    <h4 className='text-regular-14 ml-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300'>{group.name}</h4>
                </div>
                
                {/* Members Count */}
                <div className='flex flex-1 items-center gap-3 py-0 px-3 self-stretch'>
                    <p className='text-regular-14 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300'>{group.membersCount} person</p>
                </div>
                
                {/* Manager Info */}
                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                    <img
                        className='w-6 h-6 rounded-3xl'
                        src={group.manager.avatar}
                        alt={`${group.manager.name} avatar`}
                    />
                    <p className='text-regular-14 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300'>{group.manager.name}</p>
                </div>
                
                {/* Content Permissions */}
                <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch'>
                    <p className='text-regular-14 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300'>{group.permission}</p>
                </div>
                
                {/* Action Button */}
                <div className='flex justify-center items-center gap-2 w-[52px] py-0 px-3'>
                    <GroupActionButton groupId={group.id} />
                </div>
            </div>
        </li>
    );
};

export default GroupItem;