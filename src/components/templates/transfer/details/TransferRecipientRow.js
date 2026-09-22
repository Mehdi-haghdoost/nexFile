import { HistoryIcon } from '@/components/ui/icons';
import { formatDate } from '@/utils/transfers/formatDates';
import {
    TRANSFER_DELIVERY_FAILURE_FALLBACK,
    TRANSFER_DELIVERY_FAILURE_HINTS,
} from '@/utils/constants/transferConstants';

const TransferRecipientRow = ({ recipient, isLast, canRetry, isRetrying, isBusy, onRetry }) => {
    const isSent = recipient.status === 'sent';
    const failureHint = TRANSFER_DELIVERY_FAILURE_HINTS[recipient.failureCode] || TRANSFER_DELIVERY_FAILURE_FALLBACK;

    return (
        <li
            className={`
                flex items-center gap-3 px-4 py-3
                ${isLast ? '' : 'border-b border-stroke-200 dark:border-neutral-700'}
            `}
        >
            <div className='flex flex-col gap-0.5 min-w-0 flex-1'>
                <p className='truncate text-sm text-neutral-500 dark:text-neutral-200'>
                    {recipient.email}
                </p>
                {!isSent && (
                    <p className='text-xs text-error-400'>{failureHint}</p>
                )}
            </div>

            {isSent && recipient.sentAt && (
                <span className='hidden sm:inline shrink-0 text-xs text-neutral-300 dark:text-neutral-400'>
                    {formatDate(recipient.sentAt)}
                </span>
            )}

            <span
                className={`
                    shrink-0 rounded-full px-2 py-0.5 text-xs font-medium
                    ${isSent
                        ? 'bg-success-400/10 text-success-500 dark:text-success-400'
                        : 'bg-error-400/10 text-error-400'
                    }
                `}
            >
                {isSent ? 'Sent' : 'Not delivered'}
            </span>

            {!isSent && canRetry && (
                <button
                    type='button'
                    onClick={() => onRetry(recipient.email)}
                    disabled={isBusy}
                    aria-label={`Retry sending to ${recipient.email}`}
                    className='flex shrink-0 items-center gap-1.5 h-8 px-3 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient text-xs font-medium text-neutral-500 dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isRetrying ? (
                        <div className='w-3.5 h-3.5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin' />
                    ) : (
                        <HistoryIcon />
                    )}
                    Retry
                </button>
            )}
        </li>
    );
};

export default TransferRecipientRow;