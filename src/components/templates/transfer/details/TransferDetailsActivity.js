import { useId } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { describeEvent } from '@/components/templates/home/send-and-monitor/FileTable';
import { VisitorBadge } from '@/components/templates/home/send-and-monitor/FileTableRow';

// Thousands separators, so 1200 reads as 1,200
const numberFormat = new Intl.NumberFormat('en-US');

// A missing or invalid count shows as 0 rather than breaking the figure
const formatCount = (value) => numberFormat.format(Number.isFinite(value) ? value : 0);

// Relative time such as "5 minutes ago"; an unreadable date shows nothing
const formatAgo = (date) => {
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? '' : formatDistanceToNowStrict(parsed, { addSuffix: true });
};

// The exact moment, shown when hovering a relative time
const formatExact = (date) => {
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toLocaleString();
};

const BUTTON_CLASS =
    'inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg border border-stroke-200 dark:border-dark-border bg-white dark:bg-neutral-900 text-xs sm:text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed';

// The recorded figures above the timeline, defined exactly like the Monitor's
const ActivityFigures = ({ stats }) => {
    const figures = [
        { label: 'Views', value: formatCount(stats?.views), hint: 'Each visitor once per 30 minutes' },
        { label: 'Downloads', value: formatCount(stats?.downloads), hint: 'A download-all counts once' },
        { label: 'Visitors', value: formatCount(stats?.visitors), hint: 'Unique visitors' },
        {
            label: 'Last activity',
            value: stats?.lastActivityAt ? formatAgo(stats.lastActivityAt) : 'None yet',
            hint: stats?.lastActivityAt ? formatExact(stats.lastActivityAt) : 'No views or downloads',
        },
    ];

    return (
        <dl className='grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 px-4 py-3 border-b border-stroke-200 dark:border-neutral-700'>
            {figures.map((figure) => (
                <div key={figure.label} className='flex flex-col gap-0.5 min-w-0'>
                    <dt className='text-xs text-neutral-300 dark:text-neutral-400'>{figure.label}</dt>
                    <dd className='text-base font-semibold text-neutral-500 dark:text-white truncate'>{figure.value}</dd>
                    <dd className='text-[11px] text-neutral-300 dark:text-neutral-500'>{figure.hint}</dd>
                </div>
            ))}
        </dl>
    );
};

// One view or download: who, what and when
const ActivityEvent = ({ event }) => {
    const { label, icon } = describeEvent(event.kind, event.fileName);

    return (
        <li className='grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[160px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-4 py-3 border-b border-stroke-200 dark:border-neutral-700 last:border-b-0'>
            <VisitorBadge label={event.visitor} />
            <time
                dateTime={event.occurredAt}
                title={formatExact(event.occurredAt)}
                className='sm:order-3 shrink-0 text-xs text-neutral-400 dark:text-neutral-300 whitespace-nowrap'
            >
                {formatAgo(event.occurredAt)}
            </time>
            <div className='col-span-2 sm:col-span-1 sm:order-2 flex items-center gap-2 min-w-0 text-sm text-neutral-500 dark:text-neutral-200'>
                <span className='flex shrink-0'>{icon}</span>
                <span dir='auto' className='truncate'>{label}</span>
            </div>
        </li>
    );
};

const TransferDetailsActivity = ({
    stats,
    events = [],
    hasMore = false,
    isLoading = false,
    error = null,
    isLoadingMore = false,
    loadMoreError = null,
    onRetry,
    onLoadMore,
}) => {
    const titleId = useId();

    const renderBody = () => {
        // Only the first load shows a spinner; later refreshes keep what is on screen
        if (isLoading && !stats && !events.length) {
            return (
                <div className='flex items-center justify-center py-10'>
                    <div className='w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin' />
                </div>
            );
        }

        // A failed load stays inside this card, so the rest of the page keeps working
        if (error && !events.length) {
            return (
                <div role='alert' className='flex flex-col items-center gap-3 py-8 px-4 text-center'>
                    <span className='text-sm text-neutral-400 dark:text-neutral-300'>{error}</span>
                    <button type='button' onClick={onRetry} className={BUTTON_CLASS}>
                        Try again
                    </button>
                </div>
            );
        }

        return (
            <>
                <ActivityFigures stats={stats} />

                {events.length ? (
                    <ul className='flex flex-col'>
                        {events.map((event) => (
                            <ActivityEvent key={event.id} event={event} />
                        ))}
                    </ul>
                ) : (
                    <p className='px-4 py-8 text-center text-sm text-neutral-400 dark:text-neutral-300'>
                        No views or downloads yet. They will appear here once someone opens the link.
                    </p>
                )}

                {(hasMore || loadMoreError) && (
                    <div className='flex flex-col items-center gap-2 px-4 py-3 border-t border-stroke-200 dark:border-neutral-700'>
                        {loadMoreError && (
                            <span role='alert' className='text-xs text-neutral-400 dark:text-neutral-300'>{loadMoreError}</span>
                        )}
                        {hasMore && (
                            <button type='button' onClick={onLoadMore} disabled={isLoadingMore} className={BUTTON_CLASS}>
                                {isLoadingMore && (
                                    <div className='w-3.5 h-3.5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin' />
                                )}
                                {isLoadingMore ? 'Loading...' : 'Load more'}
                            </button>
                        )}
                    </div>
                )}
            </>
        );
    };

    return (
        <section
            aria-labelledby={titleId}
            aria-busy={isLoading || isLoadingMore}
            className='flex flex-col overflow-hidden rounded-xl border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'
        >
            <div className='flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-3 border-b border-stroke-200 dark:border-neutral-700 bg-stroke-100 dark:bg-neutral-800'>
                <h2 id={titleId} className='text-sm font-medium text-neutral-500 dark:text-white'>Activity</h2>
                <span className='text-xs text-neutral-400 dark:text-neutral-300'>
                    Recorded like Send and monitor, last 90 days
                </span>
            </div>

            {renderBody()}
        </section>
    );
};

export default TransferDetailsActivity;