import TransferRecipientRow from './TransferRecipientRow';

const TransferDetailsRecipients = ({
    recipients = [],
    message = '',
    isExpired = false,
    retryingTarget = null,
    onRetry,
}) => {
    const failedCount = recipients.filter((recipient) => recipient.status === 'failed').length;

    // Retrying is pointless once the link no longer works
    const canRetry = !isExpired && Boolean(onRetry);
    const isBusy = Boolean(retryingTarget);

    return (
        <div className='flex flex-col overflow-hidden rounded-xl border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'>
            <div className='flex items-center justify-between gap-3 px-4 py-3 border-b border-stroke-200 dark:border-neutral-700 bg-stroke-100 dark:bg-neutral-800'>
                <div className='flex items-center gap-2'>
                    <h2 className='text-sm font-medium text-neutral-500 dark:text-white'>Recipients</h2>
                    <span className='text-xs text-neutral-400 dark:text-neutral-300'>
                        {recipients.length} {recipients.length === 1 ? 'person' : 'people'}
                    </span>
                </div>

                {/* One click for several failures instead of retrying each row */}
                {canRetry && failedCount > 1 && (
                    <button
                        type='button'
                        onClick={() => onRetry(null)}
                        disabled={isBusy}
                        className='flex items-center gap-1.5 text-xs font-medium text-primary-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline'
                    >
                        {retryingTarget === 'all' && (
                            <div className='w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin' />
                        )}
                        Retry all failed
                    </button>
                )}
            </div>

            {message && (
                <div className='flex flex-col gap-1 px-4 py-3 border-b border-stroke-200 dark:border-neutral-700'>
                    <span className='text-xs text-neutral-300 dark:text-neutral-400'>Your message</span>
                    <p dir='auto' className='text-sm text-neutral-500 dark:text-neutral-200 whitespace-pre-line'>
                        {message}
                    </p>
                </div>
            )}

            {isExpired && failedCount > 0 && (
                <p className='px-4 py-2 text-xs text-neutral-300 dark:text-neutral-400 border-b border-stroke-200 dark:border-neutral-700'>
                    Reactivate the transfer to retry failed deliveries.
                </p>
            )}

            <ul className='flex flex-col'>
                {recipients.map((recipient, index) => (
                    <TransferRecipientRow
                        key={recipient.email}
                        recipient={recipient}
                        isLast={index === recipients.length - 1}
                        canRetry={canRetry}
                        isRetrying={retryingTarget === recipient.email || retryingTarget === 'all'}
                        isBusy={isBusy}
                        onRetry={onRetry}
                    />
                ))}
            </ul>
        </div>
    );
};

export default TransferDetailsRecipients;