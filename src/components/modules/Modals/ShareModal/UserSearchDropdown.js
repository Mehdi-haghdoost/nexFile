import PersonAvatar from './PersonAvatar';

const BLOCKED_REASON = "Your organization's sharing policy only allows sharing with its members";

const UserSearchDropdown = ({ showDropdown, searchResults, isSearching, searchTerm, handleSelectUser }) => {
    if (!showDropdown) return null;

    // Dropdown Results
    if (searchResults.length > 0) {
        return (
            <div
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E1E0E5] rounded-lg shadow-xl z-[9999] max-h-48 overflow-y-auto dark:bg-neutral-800 dark:border-neutral-700"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="p-2 bg-blue-50 text-xs text-blue-600 dark:text-white dark:bg-neutral-500">
                    {searchResults.length === 1 ? '1 person found' : `${searchResults.length} people found`}
                </div>
                {searchResults.map(user => (
                    <div
                        key={user.id}
                        title={user.isBlocked ? BLOCKED_REASON : undefined}
                        onMouseDown={(e) => {
                            if (user.isBlocked) {
                                e.preventDefault();
                                e.stopPropagation();
                                return;
                            }
                            handleSelectUser(e, user);
                        }}
                        className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border-b border-gray-100 dark:border-neutral-700 last:border-b-0 transition-colors ${
                            user.isBlocked
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-blue-50 dark:hover:bg-neutral-700 cursor-pointer'
                        }`}
                    >
                        <PersonAvatar name={user.name} email={user.email} avatar={user.avatar} size='sm' />
                        <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-1.5 flex-wrap'>
                                <p dir='auto' className='text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate'>{user.name}</p>
                                {user.isBlocked ? (
                                    <span className='text-[10px] px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex-shrink-0'>
                                        Blocked by policy
                                    </span>
                                ) : !user.isOrgMember ? (
                                    <span className='text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 flex-shrink-0'>
                                        External
                                    </span>
                                ) : null}
                            </div>
                            <p className='text-xs text-gray-500 dark:text-neutral-200 truncate'>{user.email}</p>
                        </div>
                        {!user.isBlocked && (
                            <div className="text-xs text-blue-600 bg-blue-100 dark:text-white dark:bg-neutral-900 px-2 py-1 rounded shrink-0">
                                Select
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    // No Results Message
    if (searchTerm.length > 0 && searchResults.length === 0 && !isSearching) {
        return (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E1E0E5] rounded-lg shadow-xl z-[9999] dark:bg-neutral-800 dark:border-neutral-700">
                <div className="p-3 sm:p-4 text-center text-gray-500 dark:text-neutral-200">
                    <p className="text-xs sm:text-sm font-medium dark:text-white">No people found</p>
                    <p dir="auto" className="text-xs mt-1 text-gray-400 dark:text-neutral-300 truncate px-2">No one matches "{searchTerm}"</p>
                </div>
            </div>
        );
    }

    // Loading State
    if (isSearching) {
        return (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E1E0E5] rounded-lg shadow-xl z-[9999] dark:bg-neutral-800 dark:border-neutral-700">
                <div className="p-3 sm:p-4 text-center text-gray-500 dark:text-neutral-200">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-xs sm:text-sm font-medium dark:text-white">Searching...</p>
                </div>
            </div>
        );
    }

    return null;
};

export default UserSearchDropdown;