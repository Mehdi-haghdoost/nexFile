'use client';
import MemberActionMenu from './MemberActionMenu';
import { MEMBER_ROLES, MEMBER_PERMISSIONS } from '@/utils/constants/membersConstants';

const DEFAULT_AVATAR = '/images/nav_img.png';

const MemberItem = ({ member, onUpdateMember, onRemoveMember, onCancelInvite }) => {
    const isEditable = member.kind === 'member' && !member.isOwner;

    const roleField = isEditable ? (
        <select
            value={member.role}
            onChange={(e) => onUpdateMember(member.id, { role: e.target.value })}
            className='text-sm text-neutral-500 dark:text-neutral-300 bg-transparent outline-none cursor-pointer'
        >
            {Object.values(MEMBER_ROLES).map((r) => (
                <option key={r} value={r}>{r}</option>
            ))}
        </select>
    ) : (
        <p className='text-sm text-neutral-300 dark:text-neutral-300'>{member.role}</p>
    );

    const permissionField = isEditable ? (
        <select
            value={member.permission}
            onChange={(e) => onUpdateMember(member.id, { permission: e.target.value })}
            className='text-sm text-neutral-500 dark:text-neutral-300 bg-transparent outline-none cursor-pointer'
        >
            {Object.values(MEMBER_PERMISSIONS).map((p) => (
                <option key={p} value={p}>{p}</option>
            ))}
        </select>
    ) : (
        <p className='text-sm text-neutral-300 dark:text-neutral-300'>{member.permission}</p>
    );

    const statusBadge = member.status !== 'active' && (
        <span className='text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-300 flex-shrink-0 capitalize'>
            {member.status}
        </span>
    );

    return (
        <>
            {/* Desktop view */}
            <li className='hidden lg:flex items-center gap-3 px-3 py-3 self-stretch border-b border-stroke-300 dark:border-neutral-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors group'>
                <div className='flex flex-1 items-center gap-3 min-w-0'>
                    {/* Name */}
                    <div className='flex flex-1 items-center min-h-[22px] py-0 px-3 gap-2 min-w-0'>
                        <img
                            className='w-6 h-6 rounded-full flex-shrink-0'
                            src={member.avatar || DEFAULT_AVATAR}
                            alt={`${member.name} avatar`}
                        />
                        <h4 className='text-sm text-neutral-300 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate'>{member.name}</h4>
                        {statusBadge}
                    </div>

                    {/* Role */}
                    <div className='flex flex-1 items-center gap-3 py-0 px-3 self-stretch flex-shrink-0'>
                        {roleField}
                    </div>

                    {/* Storage usage */}
                    <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch flex-shrink-0'>
                        <p className='text-sm text-neutral-300 dark:text-neutral-300'>{member.storageUsage}</p>
                    </div>

                    {/* Permissions */}
                    <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch flex-shrink-0'>
                        {permissionField}
                    </div>

                    {/* Action */}
                    <div className='flex justify-center items-center gap-2 w-[52px] py-0 px-3 flex-shrink-0'>
                        <MemberActionMenu
                            member={member}
                            onUpdateMember={onUpdateMember}
                            onRemoveMember={onRemoveMember}
                            onCancelInvite={onCancelInvite}
                        />
                    </div>
                </div>
            </li>

            {/* Mobile card view */}
            <li className='flex lg:hidden flex-col gap-3 p-3 border-b border-stroke-300 dark:border-neutral-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors'>
                <div className='flex items-center justify-between gap-2 w-full'>
                    <div className='flex items-center gap-2 flex-1 min-w-0'>
                        <img
                            className='w-8 h-8 rounded-full flex-shrink-0'
                            src={member.avatar || DEFAULT_AVATAR}
                            alt={`${member.name} avatar`}
                        />
                        <div className='flex flex-col gap-0.5 flex-1 min-w-0'>
                            <div className='flex items-center gap-2'>
                                <h4 className='text-sm font-medium text-neutral-500 dark:text-white truncate'>{member.name}</h4>
                                {statusBadge}
                            </div>
                            <span className='text-xs text-neutral-300 dark:text-neutral-300'>{member.role}</span>
                        </div>
                    </div>
                    <MemberActionMenu
                        member={member}
                        onUpdateMember={onUpdateMember}
                        onRemoveMember={onRemoveMember}
                        onCancelInvite={onCancelInvite}
                    />
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