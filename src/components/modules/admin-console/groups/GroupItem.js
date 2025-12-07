import { DesignerIcon } from "@/components/ui/icons";
import GroupActionButton from './GroupActionButton';

const GroupItem = ({ group }) => {
    return (
        <>
            {/* Desktop/Tablet View (≥ 768px) */}
            <li className='hidden md:flex items-center gap-3 px-3 py-3 self-stretch border-b border-stroke-300 dark:border-neutral-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group'>
                <div className='flex flex-1 items-center gap-3 min-w-0'>
                    {/* Group Name */}
                    <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch min-w-0'>
                        <div 
                            className={`flex justify-center items-center gap-2 p-1 h-6 w-6 rounded bg-gradient-to-b ${group.icon.gradient} shadow-[inset_0_-1px_1px_0_rgba(0,0,0,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.40)] flex-shrink-0`}
                            aria-hidden="true"
                        >
                            <DesignerIcon />
                        </div>
                        <h4 className='text-sm text-neutral-300 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate'>{group.name}</h4>
                    </div>
                    
                    {/* Members Count */}
                    <div className='flex flex-1 items-center gap-3 py-0 px-3 self-stretch flex-shrink-0'>
                        <p className='text-sm text-neutral-300 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors'>{group.membersCount} person</p>
                    </div>
                    
                    {/* Manager Info */}
                    <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch flex-shrink-0'>
                        <img
                            className='w-6 h-6 rounded-full flex-shrink-0'
                            src={group.manager.avatar}
                            alt={`${group.manager.name} avatar`}
                        />
                        <p className='text-sm text-neutral-300 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors truncate'>{group.manager.name}</p>
                    </div>
                    
                    {/* Permissions */}
                    <div className='flex items-center gap-2 w-[140px] md:w-[180px] py-0 px-3 self-stretch flex-shrink-0'>
                        <p className='text-sm text-neutral-300 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors'>{group.permission}</p>
                    </div>
                    
                    {/* Action */}
                    <div className='flex justify-center items-center gap-2 w-[52px] py-0 px-3 flex-shrink-0'>
                        <GroupActionButton groupId={group.id} />
                    </div>
                </div>
            </li>

            {/* Mobile Card View (< 768px) */}
            <li className='flex md:hidden flex-col gap-3 p-3 border-b border-stroke-300 dark:border-neutral-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors'>
                <div className='flex items-center justify-between gap-2 w-full'>
                    <div className='flex items-center gap-2 flex-1 min-w-0'>
                        <div 
                            className={`flex justify-center items-center gap-2 p-1 h-8 w-8 rounded bg-gradient-to-b ${group.icon.gradient} shadow-[inset_0_-1px_1px_0_rgba(0,0,0,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.40)] flex-shrink-0`}
                            aria-hidden="true"
                        >
                            <DesignerIcon />
                        </div>
                        <h4 className='text-sm font-medium text-neutral-500 dark:text-white truncate'>{group.name}</h4>
                    </div>
                    <GroupActionButton groupId={group.id} />
                </div>
                
                <div className='flex flex-col gap-2 pl-10'>
                    <div className='flex items-center gap-2'>
                        <span className='text-xs text-neutral-200 dark:text-neutral-400'>Members:</span>
                        <span className='text-xs text-neutral-400 dark:text-neutral-300'>{group.membersCount} person</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='text-xs text-neutral-200 dark:text-neutral-400'>Manager:</span>
                        <div className='flex items-center gap-1.5'>
                            <img
                                className='w-4 h-4 rounded-full'
                                src={group.manager.avatar}
                                alt={`${group.manager.name} avatar`}
                            />
                            <span className='text-xs text-neutral-400 dark:text-neutral-300'>{group.manager.name}</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='text-xs text-neutral-200 dark:text-neutral-400'>Access:</span>
                        <span className='text-xs text-neutral-400 dark:text-neutral-300'>{group.permission}</span>
                    </div>
                </div>
            </li>
        </>
    );
};

export default GroupItem;