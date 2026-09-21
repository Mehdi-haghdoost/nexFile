import FileIcon from '@/components/ui/FileIcon';
import {
    CloseCircleIcon,
    CopyLinkIcon,
    LinkIcon,
    RedTrashIcon,
    TransferLockIcon,
} from '@/components/ui/icons';
import TransferExpiryControl from './TransferExpiryControl';
import { getDaysRemaining } from '@/utils/transfers/formatBytes';

// Formats a date as "Sep 14, 2026"
const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

const TransferDetailsHero = ({
    transfer,
    onCopyLink,
    onOpenLink,
    onExtend,
    onEnd,
    onDelete,
    pendingAction = null,
    isDeleting = false,
}) => {
    const isExpired = transfer.status === 'expired';
    const wasEndedEarly = isExpired && Boolean(transfer.endedAt);
    const daysRemaining = getDaysRemaining(transfer.expirationDate);
    const firstExtension = transfer.files?.[0]?.extension || 'file';

    // One action at a time, so a delete cannot race an extend
    const isBusy = isDeleting || Boolean(pendingAction);

    const expiryText = wasEndedEarly
        ? `Ended early ${formatDate(transfer.endedAt)}`
        : isExpired
            ? `Expired ${formatDate(transfer.expirationDate)}`
            : `Expires ${formatDate(transfer.expirationDate)} (${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left)`;

    const buttonClasses = 'flex flex-1 sm:flex-initial items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light dark:shadow-dark-panel text-sm font-medium text-neutral-500 dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <div className='flex flex-col gap-5 p-4 md:p-6 rounded-xl border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'>
            {/* Title, badges, dates and actions */}
            <div className='flex flex-col lg:flex-row lg:items-start justify-between gap-4'>
                <div className='flex items-start gap-3 min-w-0'>
                    <div className='shrink-0 pt-0.5'>
                        <FileIcon extension={firstExtension} />
                    </div>

                    <div className='flex flex-col gap-1.5 min-w-0'>
                        <div className='flex flex-wrap items-center gap-2 min-w-0'>
                            <h1 dir='auto' className='text-lg font-medium text-neutral-500 dark:text-white truncate'>
                                {transfer.groupName}
                            </h1>

                            <span
                                className={`
                                    shrink-0 rounded-full px-2 py-0.5 text-xs font-medium
                                    ${isExpired
                                        ? 'bg-stroke-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-300'
                                        : 'bg-success-400/10 text-success-500 dark:text-success-400'
                                    }
                                `}
                            >
                                {wasEndedEarly ? 'Ended' : isExpired ? 'Expired' : 'Active'}
                            </span>

                            {transfer.isPasswordEnabled && (
                                <span className='shrink-0 flex items-center gap-1 rounded-full bg-stroke-100 dark:bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-400 dark:text-neutral-300'>
                                    <TransferLockIcon size={12} />
                                    Password
                                </span>
                            )}
                        </div>

                        <p className='text-xs text-neutral-300 dark:text-neutral-400'>
                            Created {formatDate(transfer.createdAt)} · {expiryText}
                        </p>
                    </div>
                </div>

                <div className='flex flex-wrap items-center gap-2 shrink-0'>
                    <TransferExpiryControl
                        currentExpiration={transfer.expirationDate}
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
            </div>

            {/* Share link */}
            <div className='flex flex-col gap-2'>
                <span className='text-xs font-medium text-neutral-400 dark:text-neutral-300'>
                    Share link
                </span>

                <div className='flex flex-col sm:flex-row gap-2'>
                    <input
                        type='text'
                        value={transfer.link}
                        readOnly
                        onFocus={(event) => event.target.select()}
                        className={`
                            flex-1 min-w-0 h-9 px-3 rounded-lg border border-stroke-300 dark:border-dark-border
                            bg-gray-50 dark:bg-neutral-800 text-sm text-neutral-500 dark:text-neutral-200 outline-none
                            ${isExpired ? 'line-through opacity-60' : ''}
                        `}
                    />

                    <div className='flex gap-2'>
                        {/* Copying a dead link would only mislead a recipient */}
                        <button type='button' onClick={onCopyLink} disabled={isExpired} className={buttonClasses}>
                            <CopyLinkIcon />
                            Copy
                        </button>

                        <button type='button' onClick={onOpenLink} className={buttonClasses}>
                            <LinkIcon />
                            Open
                        </button>
                    </div>
                </div>

                {isExpired && (
                    <p className='text-xs text-error-400'>
                        {wasEndedEarly
                            ? 'You ended this transfer. Reactivate it to make the link work again.'
                            : 'This link no longer works for recipients. Reactivate it to share it again.'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default TransferDetailsHero;