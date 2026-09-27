// Falls back to initials when an account has no avatar
const getInitials = (name = '') =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || '?';

const TransferUserMenu = ({ user }) => {
    // A pulsing circle holds the space until the session resolves
    if (!user) {
        return <div className='h-[38px] w-[38px] animate-pulse rounded-full bg-stroke-200 dark:bg-neutral-700' />;
    }

    const avatar = user.image ? (
        <img
            src={user.image}
            className='h-[38px] w-[38px] rounded-full object-cover'
            alt={`${user.name} profile`}
        />
    ) : (
        <span className='flex h-[38px] w-[38px] items-center justify-center rounded-full bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] text-sm font-medium text-white'>
            {getInitials(user.name)}
        </span>
    );

    return (
        <>
            <button className='hidden md:flex items-center gap-3' aria-label='User menu'>
                {avatar}
                <div className='flex max-w-[160px] flex-col items-start justify-center'>
                    <p dir='auto' className='text-medium-16 m-0 w-full truncate text-left dark:text-medium-16-white'>
                        {user.name}
                    </p>
                    <p className='text-regular-12 m-0 w-full truncate text-left text-gray-600 dark:text-regular-12-neutral-300'>
                        {user.email}
                    </p>
                </div>
            </button>

            <button className='md:hidden' aria-label='User menu'>
                {avatar}
            </button>
        </>
    );
};

export default TransferUserMenu;