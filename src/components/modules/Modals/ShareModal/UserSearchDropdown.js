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
                    {searchResults.length} users found
                </div>
                {searchResults.map(user => (
                    <div
                        key={user.id}
                        onMouseDown={(e) => handleSelectUser(e, user)}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-blue-50 dark:hover:bg-neutral-700 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                        <img
                            src={user.avatar}
                            className='w-7 h-7 sm:w-8 sm:h-8 rounded-full border shrink-0'
                            alt={user.name}
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNFNUU3RUIiLz4KPHRleHQgeD0iMTYiIHk9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjc3NDg5IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiPjw+PC90ZXh0Pgo8L3N2Zz4K'
                            }}
                        />
                        <div className='flex-1 min-w-0'>
                            <p className='text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate'>{user.name}</p>
                            <p className='text-xs text-gray-500 dark:text-neutral-200 truncate'>{user.email}</p>
                        </div>
                        <div className="text-xs text-blue-600 bg-blue-100 dark:text-white dark:bg-neutral-900 px-2 py-1 rounded shrink-0">
                            Select
                        </div>
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
                    <div className="text-xl sm:text-2xl mb-2">😔</div>
                    <p className="text-xs sm:text-sm font-medium dark:text-white">No users found</p>
                    <p className="text-xs mt-1 text-gray-400 dark:text-neutral-300 truncate px-2">You searched for "{searchTerm}"</p>
                    <p className="text-xs mt-2 text-blue-600 dark:text-primary-500">
                        Try: ruben, sarah, mike
                    </p>
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