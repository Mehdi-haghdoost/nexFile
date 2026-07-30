'use client';
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FileIcon } from '@/components/ui/icons';
import FileTableHeader from './FileTableHeader';
import FileTableRow from './FileTableRow';
import useMonitorData from '@/hooks/files/monitor/useMonitorData';

// Format a raw second count as "9m 32s"
const formatDuration = (seconds = 0) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

// Format a timestamp as a relative "12 hours ago"
const formatAccessed = (date) =>
  date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : '';

const EmptyState = ({ filterType }) => (
  <tbody>
    <tr className="h-16">
      <td colSpan="4" className="text-center py-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-neutral-400 dark:text-neutral-300">
            No {filterType.toLowerCase()} activity yet
          </span>
        </div>
      </td>
    </tr>
  </tbody>
);

const FileTable = ({ filterType = 'Viewer' }) => {
  const { rows, isLoading } = useMonitorData(filterType);

  // Map server rows into the shape the row components expect
  const data =
    filterType === 'Files'
      ? rows.map((r) => ({
          id: r.id,
          file: { name: r.fileName, icon: <FileIcon /> },
          views: `${r.viewersCount} ${r.viewersCount === 1 ? 'person' : 'people'}`,
          accessed: formatAccessed(r.lastViewedAt),
        }))
      : rows.map((r) => ({
          id: r.id,
          user: {
            name: r.viewerName,
            avatar: '/images/nav_img.png',
            altText: `${r.viewerName} avatar`,
          },
          file: { name: r.fileName, icon: <FileIcon /> },
          duration: formatDuration(r.durationSeconds),
          accessed: formatAccessed(r.viewedAt),
        }));

  if (isLoading) {
    return (
      <div className='flex items-center justify-center w-full py-16'>
        <div className='w-6 h-6 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin' />
      </div>
    );
  }

  return (
    <div className='flex flex-1 flex-col items-start self-stretch w-full'>
      {/* Desktop table view (>= 768px) */}
      <div className='hidden md:flex flex-col w-full rounded-lg border border-stroke-200 dark:border-neutral-700 overflow-hidden'>
        <div className='w-full overflow-x-auto'>
          {/* Min width: 500px on tablet, 800px on desktop */}
          <div className='min-w-[500px] xl:min-w-[800px]'>
            <table
              className="w-full"
              role="table"
              aria-label={`${filterType} data table`}
            >
              <FileTableHeader filterType={filterType} />

              {data.length > 0 ? (
                <tbody>
                  {data.map((item, index) => (
                    <FileTableRow
                      key={item.id}
                      filterType={filterType}
                      className={index % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-gray-50/30 dark:bg-neutral-800'}
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

      {/* Mobile card view (< 768px) */}
      <div className='flex md:hidden flex-col gap-2 w-full'>
        {data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              className='flex flex-col gap-2 p-3 rounded-lg border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 w-full'
            >
              {filterType === 'Viewer' && item.user && (
                <div className='flex items-center gap-2'>
                  <img
                    className="w-6 h-6 flex-shrink-0 rounded-full"
                    src={item.user.avatar}
                    alt={item.user.altText}
                  />
                  <span className='text-sm font-medium text-neutral-500 dark:text-white'>{item.user.name}</span>
                </div>
              )}

              <div className='flex items-center gap-2'>
                {item.file.icon}
                <span className='text-sm font-medium text-neutral-500 dark:text-white truncate'>{item.file.name}</span>
              </div>

              <div className='flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-300'>
                {filterType === 'Viewer' ? (
                  <>
                    <span>Duration: {item.duration}</span>
                    <span>{item.accessed}</span>
                  </>
                ) : (
                  <>
                    <span>{item.views}</span>
                    <span>{item.accessed}</span>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center gap-2 py-12">
            <span className="text-sm text-neutral-400 dark:text-neutral-300">
              No {filterType.toLowerCase()} activity yet
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileTable;