import { GlobeIcon } from '@/components/ui/icons';
import { getRoleLabel } from '@/utils/sharing/itemPermissions';
import PersonAvatar from './PersonAvatar';

const ROLE_RANK = { view: 1, edit: 2, admin: 3, owner: 4 };

// Someone may change or remove a person only when sharing is open to them and that person's role is not above theirs
const canChangePerson = (you, person) =>
    you.canShare && person.id !== you.id && (ROLE_RANK[you.role] || 0) >= (ROLE_RANK[person.role] || Infinity);

const PersonRow = ({ person, isYou, detail, children }) => (
    <div className='flex items-center min-h-[38px] sm:min-h-[42px] gap-2 sm:gap-3 self-stretch'>
        <PersonAvatar name={person.name} email={person.email} avatar={person.avatar} />
        <div className='flex flex-col flex-1 justify-center items-start min-w-0'>
            <h2 dir='auto' className='text-sm sm:text-base font-medium text-neutral-500 dark:text-white truncate w-full'>
                {person.name}{isYou ? ' (you)' : ''}
            </h2>
            <span className='text-xs text-neutral-300 dark:text-neutral-300 truncate w-full'>
                {detail || person.email}
            </span>
        </div>
        {children}
    </div>
);

const RoleText = ({ children }) => (
    <p className='text-xs text-neutral-100 dark:text-neutral-100 shrink-0'>{children}</p>
);

// Who can reach the item: the owner, people added here, and people who come in through a folder above
const AccessControlSection = ({ access, isLoading, error, onRetry, onChangeRole, onRemove, busyUserId }) => {
    if (error) {
        return (
            <div className='flex items-center justify-between gap-3 self-stretch rounded-lg border border-[#E1E0E5] dark:border-neutral-600 px-3 py-2'>
                <p className='text-xs text-error-400'>{error}</p>
                <button type='button' onClick={onRetry} className='text-xs font-medium text-primary-500 hover:underline shrink-0'>
                    Try again
                </button>
            </div>
        );
    }

    if (!access) {
        return (
            <div className='flex items-center gap-2 self-stretch py-2'>
                {isLoading && <div className='w-4 h-4 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin' />}
                <p className='text-xs text-neutral-300'>Loading who has access...</p>
            </div>
        );
    }

    const { owner, you, people, inherited } = access;

    return (
        <div className='flex flex-col items-start gap-2 self-stretch'>
            <p className='text-xs text-neutral-300 dark:text-white'>Who has access</p>

            <PersonRow person={owner} isYou={owner.id === you.id}>
                <RoleText>Owner</RoleText>
            </PersonRow>

            {people.map((person) => {
                const isYou = person.id === you.id;
                const isBusy = busyUserId === person.id;

                // Added by someone other than the owner, or reaching further through a folder above
                const detail = person.inheritedRole
                    ? `${getRoleLabel(person.inheritedRole)} via folder ${person.inheritedVia?.name}`
                    : person.sharedBy && person.sharedBy.id !== owner.id
                        ? `${person.email || ''} · Added by ${person.sharedBy.name}`
                        : null;

                return (
                    <PersonRow key={person.id} person={person} isYou={isYou} detail={detail}>
                        {canChangePerson(you, person) ? (
                            <div className='flex items-center gap-1.5 shrink-0'>
                                <select
                                    aria-label={`Access for ${person.name}`}
                                    value={person.role}
                                    disabled={isBusy}
                                    onChange={(event) => onChangeRole(person, event.target.value)}
                                    className='h-7 rounded-lg border border-[#E1E0E5] bg-white px-2 text-xs font-medium text-neutral-500 outline-none disabled:opacity-50 dark:border-dark-border dark:bg-neutral-800 dark:text-white'
                                >
                                    {you.grantableRoles.map((role) => (
                                        <option key={role} value={role}>{getRoleLabel(role)}</option>
                                    ))}
                                </select>
                                <button
                                    type='button'
                                    onClick={() => onRemove(person)}
                                    disabled={isBusy}
                                    className='text-xs px-2 py-1 rounded-md border border-error-400 text-error-400 hover:bg-error-400 hover:text-white transition-colors disabled:opacity-50 dark:text-white dark:border-neutral-400'
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <RoleText>{getRoleLabel(person.role)}</RoleText>
                        )}
                    </PersonRow>
                );
            })}

            {/* Changed on the folder they come from, so they are shown read-only here */}
            {inherited.map((person) => (
                <PersonRow
                    key={`inherited-${person.id}`}
                    person={person}
                    isYou={person.id === you.id}
                    detail={`Via folder ${person.via?.name}`}
                >
                    <RoleText>{getRoleLabel(person.role)}</RoleText>
                </PersonRow>
            ))}

            <div className='flex items-center gap-2 self-stretch mt-1 py-2 px-3 rounded-lg border border-[#E1E0E5] bg-stroke-100 dark:bg-neutral-900 dark:border-neutral-600'>
                <GlobeIcon className='shrink-0' />
                <div className='flex flex-col min-w-0'>
                    <p className='text-xs font-medium text-neutral-500 dark:text-white'>Public access</p>
                    <p className='text-xs text-neutral-300 dark:text-neutral-300'>Public links aren't available yet</p>
                </div>
            </div>
        </div>
    );
};

export default AccessControlSection;