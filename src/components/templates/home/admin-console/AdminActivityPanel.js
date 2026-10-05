'use client';

import { useActivity } from '@/hooks/admin/useActivity';
import { formatDate } from '@/utils/transfers/formatDates';

// The most recent entries only; the Activity section shows the full log
const PREVIEW_LIMIT = 8;

const AdminActivityPanel = () => {
    const { activities, isLoading, error } = useActivity('all');

    const recent = activities.slice(0, PREVIEW_LIMIT);

    return (
        <div className='flex flex-col'>
            <div className='px-4 py-3 border-b border-stroke-200 dark:border-neutral-700 bg-stroke-100 dark:bg-neutral-900'>
                <h2 className='text-sm font-medium text-neutral-500 dark:text-white'>Recent activity</h2>
            </div>

            {isLoading ? (
                <div className='flex justify-center py-8'>
                    <div className='h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent' />
                </div>
            ) : error ? (
                <p className='px-4 py-8 text-center text-xs text-error-400'>{error}</p>
            ) : recent.length === 0 ? (
                <p className='px-4 py-8 text-center text-xs text-neutral-300 dark:text-neutral-400'>
                    Nothing has been recorded yet
                </p>
            ) : (
                <ul className='flex max-h-[320px] flex-col overflow-y-auto custom-scrollbar'>
                    {recent.map((activity) => (
                        <li
                            key={activity.id}
                            className='flex flex-col gap-0.5 px-4 py-3 border-b border-stroke-200 dark:border-neutral-700 last:border-0'
                        >
                            <span className='text-xs font-medium text-neutral-500 dark:text-white'>
                                {activity.action || activity.title}
                            </span>
                            <span dir='auto' className='truncate text-xs text-neutral-300 dark:text-neutral-400'>
                                {activity.actor?.name || activity.user || activity.description}
                            </span>
                            <span className='text-[11px] text-neutral-300 dark:text-neutral-500'>
                                {formatDate(activity.createdAt || activity.timestamp)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminActivityPanel;