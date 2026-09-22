import { MoreVerticalIcon, TransferLockIcon } from '@/components/ui/icons';

// The first file's type decides the row icon
export const getFirstFileExtension = (transfer) => transfer.files?.[0]?.extension || 'file';

// Expired transfers are dimmed so status reads without a badge column
export const getRowTone = (transfer) => (transfer.status === 'expired' ? 'opacity-60' : '');

// Menu trigger shared by every layout
export const TransferActionButton = ({ transfer, size = 'md', isDeleting, isMenuOpen, onToggleMenu }) => (
    <button
        type='button'
        className={`
            flex items-center justify-center shadow-custom border border-stroke-200 dark:border-neutral-600
            bg-white dark:bg-neutral-700 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-600
            transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
            ${size === 'md' ? 'w-8 h-8 p-1 hover:scale-105 group-hover:shadow-middle' : 'w-7 h-7'}
        `}
        onClick={(event) => onToggleMenu(event, transfer.id)}
        disabled={isDeleting}
        aria-label={`Actions for ${transfer.groupName}`}
        aria-expanded={isMenuOpen}
    >
        {isDeleting ? (
            <div className='w-3.5 h-3.5 border-2 border-error-400 border-t-transparent rounded-full animate-spin' />
        ) : (
            <MoreVerticalIcon height={size === 'md' ? 12 : 10} />
        )}
    </button>
);

// Marks transfers that recipients need a password for
export const TransferLockBadge = ({ transfer, size = 14 }) => {
    if (!transfer.isPasswordEnabled) return null;

    return (
        <span title='Password protected' aria-label='Password protected' className='shrink-0 flex items-center'>
            <TransferLockIcon size={size} />
        </span>
    );
};

// Icon and count pair used by the compact layouts
export const TransferStat = ({ value, Icon }) => (
    <div className='flex items-center gap-1'>
        <Icon size={12} />
        <span className='text-xs font-medium text-neutral-500 dark:text-neutral-200'>{value}</span>
    </div>
);