import { getRoleLabel } from '@/utils/sharing/itemPermissions';
import PersonAvatar from './PersonAvatar';

// A person picked for this batch, with the role they will get
const InvitedUserItem = ({ user, roleOptions, onRoleChange, onRemove, disabled }) => {
    return (
        <div
            className='flex items-center min-h-[45px] sm:min-h-[50px] gap-2 sm:gap-3 self-stretch bg-green-50 border border-green-200 rounded-lg px-2 sm:px-3 py-2 dark:bg-neutral-900 dark:border-neutral-600'
            onMouseDown={(e) => e.stopPropagation()}
        >
            <PersonAvatar name={user.name} email={user.email} avatar={user.avatar} size='sm' />
            <div className='flex flex-col flex-1 justify-center items-start min-w-0'>
                <h2 dir='auto' className='text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate w-full'>{user.name}</h2>
                <span className='text-xs text-gray-600 dark:text-neutral-300 truncate w-full'>{user.email}</span>
            </div>
            <div className='flex items-center gap-1.5 sm:gap-2 shrink-0'>
                <select
                    aria-label={`Role for ${user.name}`}
                    value={user.permission}
                    disabled={disabled}
                    onChange={(e) => onRoleChange(user.id, e.target.value)}
                    className='h-7 rounded-lg border border-[#E1E0E5] bg-white px-2 text-xs font-medium text-neutral-500 outline-none disabled:opacity-50 dark:border-dark-border dark:bg-neutral-800 dark:text-white'
                >
                    {roleOptions.map((role) => (
                        <option key={role} value={role}>{getRoleLabel(role)}</option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={() => onRemove(user.id)}
                    disabled={disabled}
                    aria-label={`Remove ${user.name} from this invitation`}
                    className='text-error-400 hover:text-white hover:bg-error-400 text-xs px-2 sm:px-3 py-1 rounded-md border border-error-400 transition-all duration-200 disabled:opacity-50 dark:text-white dark:border-neutral-400 dark:hover:bg-error-400 whitespace-nowrap'
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default InvitedUserItem;