'use client';
import MembersTableHeader from './MembersTableHeader';
import MemberItem from '@/components/modules/admin-console/members/MemberItem';

const MembersList = ({ members, isLoading, error, activeTab, onUpdateMember, onRemoveMember, onCancelInvite }) => {
    return (
        <section
            className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 overflow-hidden w-full'
            aria-label="Members list"
        >
            <MembersTableHeader />

            {isLoading ? (
                <div className='flex items-center justify-center w-full py-16'>
                    <div className='w-6 h-6 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin' />
                </div>
            ) : error ? (
                <div className='flex flex-col items-center justify-center w-full py-16 gap-1 text-center px-4'>
                    <p className='text-sm text-red-500'>Failed to load members</p>
                    <p className='text-xs text-neutral-400'>{error}</p>
                </div>
            ) : members.length === 0 ? (
                <div className='flex items-center justify-center w-full py-16'>
                    <p className='text-sm text-neutral-400 dark:text-neutral-300'>
                        {activeTab === 'suggested' ? 'No suggestions yet' : 'No members found'}
                    </p>
                </div>
            ) : (
                <ul className="w-full">
                    {members.map((member) => (
                        <MemberItem
                            key={member.id}
                            member={member}
                            onUpdateMember={onUpdateMember}
                            onRemoveMember={onRemoveMember}
                            onCancelInvite={onCancelInvite}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
};

export default MembersList;