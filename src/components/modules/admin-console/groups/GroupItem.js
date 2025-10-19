import { DesignerIcon } from "@/components/ui/icons";
import GroupActionButton from './GroupActionButton';

const GroupItem = ({ group }) => {
    return (
        <li className='flex items-center gap-2 h-[52px] py-[13px] px-3 self-stretch border-b border-stroke-100 last:border-b-0'>
            <div className='flex flex-1 items-center gap-2'>
                {/* Group Name Container */}
                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                    <div 
                        className={`flex justify-center items-center gap-2 p-1 h-6 w-6 rounded bg-gradient-to-b ${group.icon.gradient} shadow-[inset_0_-1px_1px_0_rgba(0,0,0,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.40)] aspect-square`}
                        aria-hidden="true"
                    >
                        <DesignerIcon />
                    </div>
                    <h4 className='text-medium-14'>{group.name}</h4>
                </div>
                
                {/* Members Count */}
                <div className='flex flex-1 items-center gap-3 py-0 px-3 self-stretch'>
                    <p className='text-medium-14'>{group.membersCount} person</p>
                </div>
                
                {/* Manager Info */}
                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                    <img
                        className='w-6 h-6 rounded-3xl'
                        src={group.manager.avatar}
                        alt={`${group.manager.name} avatar`}
                    />
                    <p className='text-medium-14'>{group.manager.name}</p>
                </div>
                
                {/* Content Permissions */}
                <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch'>
                    <p className='text-medium-14'>{group.permission}</p>
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