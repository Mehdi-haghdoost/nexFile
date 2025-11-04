import InvitedUserItem from './InvitedUserItem';

const InvitedUsersList = ({ invitedUsers, handleRemoveUser, handleProceedToReview }) => {
    if (invitedUsers.length === 0) return null;

    return (
        <div className='flex flex-col items-start gap-3 self-stretch'>
            <div className="flex items-center justify-between w-full">
                <p className='text-regular-12-neutral-300 dark:text-regular-12-white'>Invited users</p>
                <span className="bg-blue-100 dark:bg-primary-500/20 text-blue-800 dark:text-primary-500 text-xs px-2 py-1 rounded-full">
                    {invitedUsers.length} people
                </span>
            </div>
            {invitedUsers.map(user => (
                <InvitedUserItem
                    key={user.id}
                    user={user}
                    handleRemoveUser={handleRemoveUser}
                    handleProceedToReview={handleProceedToReview}
                />
            ))}
        </div>
    );
};

export default InvitedUsersList;