const InvitedUserItem = ({ user, handleRemoveUser, handleProceedToReview }) => {
    return (
        <div
            className='flex items-center h-[50px] gap-3 self-stretch bg-green-50 border border-green-200 rounded-lg px-3'
            onMouseDown={(e) => e.stopPropagation()}
        >
            <img
                src={user.avatar}
                className='w-[36px] h-[36px] rounded-full border-2 border-green-300'
                alt={user.name}
                onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iMTgiIGZpbGw9IiM0QUY1MEEiLz4KPHN2ZyB4PSI5IiB5PSI5IiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIGZpbGw9IndoaXRlIj4KICA8cGF0aCBkPSJNOSAwQzQuMDMgMCAwIDQuMDMgMCA5czQuMDMgOSA5IDkgOS00LjAzIDktOVM4LjU3IDAgOSAwem0wIDRjMS42NiAwIDMgMS4zNCAzIDNzLTEuMzQgMy0zIDMtMy0xLjM0LTMtM1M3LjM0IDQgOSA0em0wIDEwYy0yLjMzIDAtNC4zMS0xLjE5LTUuNS0zQzQuNjkgOC42OSA2LjY3IDggOSA4czQuMzEuNjkgNS41IDMuNUM5LjMxIDEzLjgxIDExLjMzIDE0IDkgMTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4K'
                }}
            />
            <div className='flex flex-col flex-1 justify-center items-start'>
                <h2 className='text-medium-15 text-gray-900'>{user.name}</h2>
                <span className='text-regular-12 text-gray-600'>{user.email}</span>
            </div>
            <button
                type="button"
                onMouseDown={(e) => {
                    e.stopPropagation();
                    handleProceedToReview(user);
                }}
                className='text-blue-600 hover:text-white hover:bg-blue-600 text-xs px-3 py-1 rounded-md border border-blue-300 transition-all duration-200 mr-2'
            >
                Share
            </button>

            <button
                type="button"
                onMouseDown={(e) => handleRemoveUser(e, user.id)}
                className='text-red-500 hover:text-white hover:bg-red-500 text-xs px-3 py-1 rounded-md border border-red-300 transition-all duration-200'
            >
                Remove
            </button>
        </div>
    );
};

export default InvitedUserItem;