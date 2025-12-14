const InvitedUserItem = ({ user, handleRemoveUser, handleProceedToReview }) => {
    return (
        <div
            className='flex items-center min-h-[45px] sm:h-[50px] gap-2 sm:gap-3 self-stretch bg-green-50 border border-green-200 rounded-lg px-2 sm:px-3 py-2 sm:py-0 dark:bg-neutral-900 dark:border-neutral-600'
            onMouseDown={(e) => e.stopPropagation()}
        >
            <img
                src={user.avatar}
                className='w-8 h-8 sm:w-[36px] sm:h-[36px] rounded-full border-2 border-green-300 shrink-0'
                alt={user.name}
                onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iMTgiIGZpbGw9IiM0QUY1MEEiLz4KPHN2ZyB4PSI5IiB5PSI5IiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIGZpbGw9IndoaXRlIj4KICA8cGF0aCBkPSJNOSAwQzQuMDMgMCAwIDQuMDMgMCA5czQuMDMgOSA5IDkgOS00LjAzIDktOVM4LjU3IDAgOSAwem0wIDRjMS42NiAwIDMgMS4zNCAzIDNzLTEuMzQgMy0zIDMtMy0xLjM0LTMtM1M3LjM0IDQgOSA0em0wIDEwYy0yLjMzIDAtNC4zMS0xLjE5LTUuNS0zQzQuNjkgOC42OSA2LjY3IDggOSA4czQuMzEuNjkgNS41IDMuNUM5LjMxIDEzLjgxIDExLjMzIDE0IDkgMTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4K'
                }}
            />
            <div className='flex flex-col flex-1 justify-center items-start min-w-0'>
                <h2 className='text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate w-full'>{user.name}</h2>
                <span className='text-xs text-gray-600 dark:text-neutral-300 truncate w-full'>{user.email}</span>
            </div>
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-1 sm:gap-2 shrink-0'>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        handleProceedToReview(user);
                    }}
                    className='text-primary-500 hover:text-white hover:bg-primary-500 text-xs px-2 sm:px-3 py-1 rounded-md border border-primary-500 transition-all duration-200 dark:text-white dark:border-neutral-400 dark:hover:bg-primary-500 dark:hover:text-white whitespace-nowrap'
                >
                    Share
                </button>

                <button
                    type="button"
                    onMouseDown={(e) => handleRemoveUser(e, user.id)}
                    className='text-error-400 hover:text-white hover:bg-error-400 text-xs px-2 sm:px-3 py-1 rounded-md border border-error-400 transition-all duration-200 dark:text-white dark:border-neutral-400 dark:hover:bg-error-400 dark:hover:text-white whitespace-nowrap'
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default InvitedUserItem;