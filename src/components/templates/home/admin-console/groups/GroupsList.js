'use client';
import GroupsTableHeader from './GroupsTableHeader';
import GroupItem from '@/components/modules/admin-console/groups/GroupItem';

const GroupsList = ({ groups, isLoading, error, onUpdateGroup, onDeleteGroup }) => {
    return (
        <section
            className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 overflow-hidden w-full'
            aria-label="Groups list"
        >
            <GroupsTableHeader />

            {isLoading ? (
                <div className='flex items-center justify-center w-full py-16'>
                    <div className='w-6 h-6 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin' />
                </div>
            ) : error ? (
                <div className='flex flex-col items-center justify-center w-full py-16 gap-1 text-center px-4'>
                    <p className='text-sm text-red-500'>Failed to load groups</p>
                    <p className='text-xs text-neutral-400'>{error}</p>
                </div>
            ) : groups.length === 0 ? (
                <div className='flex items-center justify-center w-full py-16'>
                    <p className='text-sm text-neutral-400 dark:text-neutral-300'>No groups yet</p>
                </div>
            ) : (
                <ul className="w-full">
                    {groups.map((group) => (
                        <GroupItem
                            key={group.id}
                            group={group}
                            onUpdateGroup={onUpdateGroup}
                            onDeleteGroup={onDeleteGroup}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
};

export default GroupsList;