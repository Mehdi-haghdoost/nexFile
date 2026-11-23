import InvitedUserItem from './InvitedUserItem';

// The people picked for this batch, all shared with in one request
const InvitedUsersList = ({ invitedUsers, roleOptions, onRoleChange, onRemove, disabled }) => {
    if (invitedUsers.length === 0) return null;

    return (
        <div className='flex flex-col items-start gap-2 sm:gap-3 self-stretch'>
            <div className="flex items-center justify-between w-full">
                <p className='text-xs text-neutral-300 dark:text-white'>Invite</p>
                <span className="bg-blue-100 dark:bg-primary-500/20 text-blue-800 dark:text-primary-500 text-xs px-2 py-0.5 sm:py-1 rounded-full">
                    {invitedUsers.length === 1 ? '1 person' : `${invitedUsers.length} people`}
                </span>
            </div>
            {invitedUsers.map(user => (
                <InvitedUserItem
                    key={user.id}
                    user={user}
                    roleOptions={roleOptions}
                    onRoleChange={onRoleChange}
                    onRemove={onRemove}
                    disabled={disabled}
                />
            ))}
        </div>
    );
};

export default InvitedUsersList;