'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns';
import { DownloadIcon, FileIcon, ViewIcon } from '@/components/ui/icons';
import FileTableHeader, { getMonitorColumns } from './FileTableHeader';
import FileTableRow, { StatusBadge, VisitorBadge } from './FileTableRow';
import useMonitorData from '@/hooks/files/monitor/useMonitorData';

// Format a raw second count as "9m 32s"
const formatDuration = (seconds = 0) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

// Format a timestamp as a relative "12 hours ago"; an unreadable date shows nothing
const formatAccessed = (date) => {
  if (!date) return '';

  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? '' : formatDistanceToNow(parsed, { addSuffix: true });
};

// Short relative time such as "2 hours ago", without "about" or "less than", so it fits a narrow column
const formatShortAgo = (date) => {
  if (!date) return '';

  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? '' : formatDistanceToNowStrict(parsed, { addSuffix: true });
};

// "1 visitor", "3 visitors"
const pluralize = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

// What each recorded event reads as, with a matching icon
const describeEvent = (kind, fileName) => {
  if (kind === 'download') {
    return { label: fileName ? `Downloaded ${fileName}` : 'Downloaded a file', icon: <DownloadIcon /> };
  }

  if (kind === 'download_all') {
    return { label: 'Downloaded all files', icon: <DownloadIcon /> };
  }

  return { label: 'Viewed the transfer', icon: <ViewIcon /> };
};

// Shapes one activity API row for the row components
const toActivityItem = (r) => ({
  id: r.id,
  visitor: r.visitor || 'Visitor',
  transfer: { id: r.transferId, name: r.transferName || 'Untitled transfer' },
  event: describeEvent(r.kind, r.fileName),
  accessed: formatShortAgo(r.occurredAt),
});

// Shapes one transfer summary row for the row components
const toTransferItem = (r) => ({
  id: r.id,
  transfer: { id: r.id, name: r.name || 'Untitled transfer' },
  status: r.status,
  visitors: r.visitors ?? 0,
  views: r.views ?? 0,
  downloads: r.downloads ?? 0,
  lastActivity: r.lastActivityAt ? formatShortAgo(r.lastActivityAt) : 'No activity yet',
});

// What an empty tab tells the user
const EMPTY_MESSAGES = {
  activity: 'No activity yet. Views and downloads of your transfers will appear here.',
  transfers: 'No transfers yet. Transfers you send will appear here.',
};

const getEmptyMessage = (filterType) =>
  EMPTY_MESSAGES[filterType] || `No ${filterType.toLowerCase()} activity yet`;

const EmptyState = ({ filterType }) => (
  <tbody>
    <tr className="h-16">
      <td colSpan={getMonitorColumns(filterType).length} className="text-center py-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-neutral-400 dark:text-neutral-300">
            {getEmptyMessage(filterType)}
          </span>
        </div>
      </td>
    </tr>
  </tbody>
);

// Shown when the activity request fails, with a way to try again
const ErrorState = ({ message, onRetry }) => (
  <div
    role='alert'
    className='flex flex-col items-center justify-center gap-3 w-full py-12 rounded-lg border border-stroke-200 dark:border-neutral-700'
  >
    <span className='text-sm text-neutral-400 dark:text-neutral-300'>{message}</span>
    <button
      type='button'
      onClick={onRetry}
      className='px-3 py-1 rounded-lg border border-stroke-200 dark:border-dark-border text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800'
    >
      Try again
    </button>
  </div>
);

const FileTable = ({ filterType = 'activity' }) => {
  const router = useRouter();
  const { rows, isLoading, error, refetch } = useMonitorData(filterType);
  const isTransfersTab = filterType === 'transfers';

  // Map server rows into the shape the row components expect
  const data = isTransfersTab ? rows.map(toTransferItem) : rows.map(toActivityItem);

  // Opens the transfer's own details page
  const openTransfer = (id) => router.push(`/transfer/${encodeURIComponent(id)}`);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center w-full py-16'>
        <div className='w-6 h-6 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin' />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  return (
    <div className='flex flex-1 flex-col items-start self-stretch w-full'>
      {/* Desktop table view (>= 1024px) */}
      <div className='hidden lg:flex flex-col w-full rounded-lg border border-stroke-200 dark:border-neutral-700 overflow-hidden'>
        <div className='w-full overflow-x-auto'>
          {/* Fixed table layout keeps long names from widening the table past its container */}
          <div className='w-full'>
            <table
              className="w-full table-fixed"
              role="table"
              aria-label={isTransfersTab ? 'Transfers table' : 'Activity table'}
            >
              <FileTableHeader filterType={filterType} />

              {data.length > 0 ? (
                <tbody>
                  {data.map((item, index) => (
                    <FileTableRow
                      key={item.id}
                      filterType={filterType}
                      className={index % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-gray-50/30 dark:bg-neutral-800'}
                      onOpen={isTransfersTab ? () => openTransfer(item.id) : undefined}
                      {...item}
                    />
                  ))}
                </tbody>
              ) : (
                <EmptyState filterType={filterType} />
              )}
            </table>
          </div>
        </div>
      </div>

      {/* Mobile and tablet card view (< 1024px) */}
      <div className='flex lg:hidden flex-col gap-2 w-full'>
        {data.length > 0 ? (
          data.map((item) =>
            isTransfersTab ? (
              <button
                key={item.id}
                type='button'
                onClick={() => openTransfer(item.id)}
                className='flex flex-col gap-2 p-3 rounded-lg border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 w-full text-left hover:bg-gray-50 dark:hover:bg-neutral-700'
              >
                <div className='flex items-center justify-between gap-2 w-full'>
                  <div className='flex items-center gap-2 min-w-0'>
                    <span className='flex-shrink-0'>
                      <FileIcon />
                    </span>
                    <span className='text-sm font-medium text-neutral-500 dark:text-white truncate'>{item.transfer.name}</span>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div className='flex items-center justify-between gap-2 w-full text-xs text-neutral-400 dark:text-neutral-300'>
                  <span>
                    {pluralize(item.visitors, 'visitor')} · {pluralize(item.views, 'view')} · {pluralize(item.downloads, 'download')}
                  </span>
                  <span className='flex-shrink-0'>{item.lastActivity}</span>
                </div>
              </button>
            ) : (
              <div
                key={item.id}
                className='flex flex-col gap-2 p-3 rounded-lg border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 w-full'
              >
                <div className='flex items-center justify-between gap-2'>
                  <VisitorBadge label={item.visitor} />
                  <span className='flex-shrink-0 text-xs text-neutral-400 dark:text-neutral-300'>{item.accessed}</span>
                </div>

                <div className='flex items-center gap-2'>
                  <span className='flex-shrink-0'>
                    <FileIcon />
                  </span>
                  <span className='text-sm font-medium text-neutral-500 dark:text-white truncate'>{item.transfer.name}</span>
                </div>

                <div className='flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-300'>
                  <span className='flex-shrink-0'>{item.event.icon}</span>
                  <span className='truncate'>{item.event.label}</span>
                </div>
              </div>
            )
          )
        ) : (
          <div className="flex flex-col items-center gap-2 py-12">
            <span className="text-sm text-neutral-400 dark:text-neutral-300">
              {getEmptyMessage(filterType)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileTable;