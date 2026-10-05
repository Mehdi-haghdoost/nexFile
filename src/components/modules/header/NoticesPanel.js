import React from 'react';
import Link from 'next/link';
import { AccessLinkIcon, FolderIcon2, RedTrashIcon } from '@/components/ui/icons';
import { FILE_NOTICE_TYPES } from '@/utils/files/fileNotices';
import { formatDate } from '@/utils/transfers/formatDates';

// Each kind of notice gets the icon that matches what happened
const NOTICE_ICONS = {
    [FILE_NOTICE_TYPES.SHARED]: AccessLinkIcon,
    [FILE_NOTICE_TYPES.TRASHED]: RedTrashIcon,
    [FILE_NOTICE_TYPES.RECENT_FOLDER]: FolderIcon2,
};

const NoticesPanel = ({ notices, isLoading, seenAt }) => {
    const rowClasses = 'flex items-start gap-3 px-4 py-3 transition-colors';

    const renderBody = (notice) => (
        <>
            <span className='mt-0.5 shrink-0'>
                {React.createElement(NOTICE_ICONS[notice.type] || FolderIcon2)}
            </span>

            <span className='flex min-w-0 flex-1 flex-col gap-0.5'>
                <span className='text-xs font-medium text-neutral-500 dark:text-white'>
                    {notice.title}
                </span>
                <span dir='auto' className='truncate text-xs text-neutral-300 dark:text-neutral-400'>
                    {notice.detail}
                </span>
                <span className='text-[11px] text-neutral-300 dark:text-neutral-500'>
                    {formatDate(notice.at)}
                </span>
            </span>
        </>
    );

    return (
        <div className='flex flex-col'>
            <div className='px-4 py-3 border-b border-stroke-200 dark:border-neutral-700 bg-stroke-100 dark:bg-neutral-900'>
                <h2 className='text-sm font-medium text-neutral-500 dark:text-white'>Activity</h2>
            </div>

            {isLoading ? (
                <div className='flex justify-center py-8'>
                    <div className='h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent' />
                </div>
            ) : notices.length === 0 ? (
                <p className='px-4 py-8 text-center text-xs text-neutral-300 dark:text-neutral-400'>
                    Shared files and folders you work in show up here
                </p>
            ) : (
                <ul className='flex max-h-[320px] flex-col overflow-y-auto custom-scrollbar'>
                    {notices.map((notice) => {
                        const isUnread = new Date(notice.at).getTime() > seenAt;
                        const tint = isUnread ? 'bg-primary-50/60 dark:bg-primary-bg' : '';

                        return (
                            <li key={notice.id} className='border-b border-stroke-200 dark:border-neutral-700 last:border-0'>
                                {/* A trash notice has nowhere to go, so it is not a link */}
                                {notice.href ? (
                                    <Link
                                        href={notice.href}
                                        className={`${rowClasses} hover:bg-[#F6F6F7] dark:hover:bg-dark-overlay ${tint}`}
                                    >
                                        {renderBody(notice)}
                                    </Link>
                                ) : (
                                    <div className={`${rowClasses} ${tint}`}>
                                        {renderBody(notice)}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default NoticesPanel;