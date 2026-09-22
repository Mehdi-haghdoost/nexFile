import { formatDate } from '@/utils/transfers/formatDates';

const TransferDetailsRecipients = ({ recipients = [], message = '' }) => {
    return (
        <div className='flex flex-col overflow-hidden rounded-xl border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'>
            <div className='flex items-center justify-between px-4 py-3 border-b border-stroke-200 dark:border-neutral-700 bg-stroke-100 dark:bg-neutral-800'>
                <h2 className='text-sm font-medium text-neutral-500 dark:text-white'>Recipients</h2>
                <span className='text-xs text-neutral-400 dark:text-neutral-300'>
                    {recipients.length} {recipients.length === 1 ? 'person' : 'people'}
                </span>
            </div>

            {message && (
                <div className='flex flex-col gap-1 px-4 py-3 border-b border-stroke-200 dark:border-neutral-700'>
                    <span className='text-xs text-neutral-300 dark:text-neutral-400'>Your message</span>
                    <p dir='auto' className='text-sm text-neutral-500 dark:text-neutral-200 whitespace-pre-line'>
                        {message}
                    </p>
                </div>
            )}

            <ul className='flex flex-col'>
                {recipients.map((recipient, index) => {
                    const isSent = recipient.status === 'sent';

                    return (
                        <li
                            key={recipient.email}
                            className={`
                                flex items-center gap-3 px-4 py-3
                                ${index !== recipients.length - 1 ? 'border-b border-stroke-200 dark:border-neutral-700' : ''}
                            `}
                        >
                            <p className='flex-1 min-w-0 truncate text-sm text-neutral-500 dark:text-neutral-200'>
                                {recipient.email}
                            </p>

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
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TransferDetailsRecipients;