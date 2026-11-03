import React from 'react';

// Columns per tab; rows read the same widths so every cell lines up with its header
// Fixed columns are compact and never shrink, so the flexible text columns take the remaining width
export const MONITOR_COLUMNS = {
  activity: [
    { id: 'visitor', label: 'Visitor', width: 'w-[150px] shrink-0' },
    { id: 'transfer', label: 'Transfer', width: 'flex-1 min-w-0' },
    { id: 'event', label: 'Event', width: 'flex-1 min-w-0' },
    { id: 'when', label: 'When', width: 'w-[136px] shrink-0' }
  ],
  transfers: [
    { id: 'transfer', label: 'Transfer', width: 'flex-1 min-w-0' },
    { id: 'status', label: 'Status', width: 'w-[124px] shrink-0' },
    { id: 'visitors', label: 'Visitors', width: 'w-[80px] shrink-0' },
    {
      id: 'views',
      label: 'Views',
      width: 'w-[68px] shrink-0',
      hint: 'Recorded views in the retained activity history (up to 90 days): one per visitor every 30 minutes. A different period from the 7-day summary cards.',
    },
    {
      id: 'downloads',
      label: 'Downloads',
      width: 'w-[104px] shrink-0',
      hint: 'Recorded download actions in the retained activity history (up to 90 days); a download-all counts once.',
    },
    { id: 'lastActivity', label: 'Last activity', width: 'w-[128px] shrink-0' }
  ]
};

// An unknown tab falls back to the activity columns
export const getMonitorColumns = (filterType) =>
  MONITOR_COLUMNS[filterType] || MONITOR_COLUMNS.activity;

// Width class of one column, so a row cell matches its header cell
export const getColumnWidth = (filterType, columnId) =>
  getMonitorColumns(filterType).find((column) => column.id === columnId)?.width || '';

const FileTableHeader = ({ filterType }) => {
  const columns = getMonitorColumns(filterType);

  return (
    <thead>
      <tr className='flex items-center gap-2 py-[13px] px-3 h-10 self-stretch border border-stroke-300 bg-stroke-100 dark:bg-neutral-800 dark:border-neutral-700'>
        {columns.map((column) => (
          <th
            key={column.id}
            className={`flex items-center gap-2 py-0 px-3 ${column.width}`}
            scope="col"
          >
            {/* A hinted column explains how its numbers are counted when hovered */}
            <span
              className={`text-regular-14 dark:text-regular-14-neutral-300 truncate ${
                column.hint ? 'underline decoration-dotted underline-offset-4 cursor-help' : ''
              }`}
              title={column.hint}
            >
              {column.label}
            </span>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default FileTableHeader;