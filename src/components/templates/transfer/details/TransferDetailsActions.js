import { CloseCircleIcon, RedTrashIcon } from '@/components/ui/icons';
import TransferExpiryControl from './TransferExpiryControl';

const TransferDetailsActions = ({
    expirationDate,
    isExpired,
    pendingAction,
    isDeleting,
    onExtend,
    onEnd,
    onDelete,
}) => {
    // One action at a time, so a delete cannot race an extend
    const isBusy = isDeleting || Boolean(pendingAction);

    return (
        <div className='flex flex-wrap items-center gap-2 shrink-0'>
            <TransferExpiryControl
                currentExpiration={expirationDate}
                isExpired={isExpired}
                isPending={pendingAction === 'extend'}
                disabled={isBusy}
                onSelect={onExtend}
            />

            {/* Hidden once expired, since there is nothing left to end */}
            {!isExpired && (
                <button
                    type='button'
                    onClick={onEnd}
                    disabled={isBusy}
                    className='flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light dark:shadow-dark-panel text-sm font-medium text-neutral-500 dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {pendingAction === 'end' ? (
                        <div className='w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin' />
                    ) : (
                        <CloseCircleIcon />
                    )}
                    End now
                </button>
            )}

            <button
                type='button'
                onClick={onDelete}
                disabled={isBusy}
                className='flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient text-sm font-medium text-error-400 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed'
            >
                {isDeleting ? (
                    <div className='w-4 h-4 border-2 border-error-400 border-t-transparent rounded-full animate-spin' />
                ) : (
                    <RedTrashIcon />
                )}
                Delete
            </button>
        </div>
    );
};

export default TransferDetailsActions;