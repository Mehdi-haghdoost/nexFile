import React from 'react';
import { FileIcon } from '@/components/ui/icons';
import { getColumnWidth } from './FileTableHeader';

// User Avatar Component
const UserAvatar = ({ user }) => (
  <div className="flex items-center gap-2">
    <img
      className="w-6 h-6 flex-shrink-0 rounded-full bg-cover bg-center"
      src={user.avatar}
      alt={user.altText}
    />
    <span className='text-medium-14 dark:text-medium-14-white'>{user.name}</span>
  </div>
);

// File Info Component  
const FileInfo = ({ file }) => (
  <div className='flex items-center gap-3'>
    {file.icon}
    <span className='text-medium-14 dark:text-medium-14-white'>{file.name}</span>
  </div>
);

// Viewer Row (shows user, file, duration, accessed)
const ViewerRow = ({ user, file, duration, accessed }) => (
  <>
    <td className='flex items-center gap-2 w-[300px] py-0 px-3'>
      <UserAvatar user={user} />
    </td>
    <td className='flex flex-1 items-center gap-3 py-0 px-3'>
      <FileInfo file={file} />
    </td>
    <td className='flex items-center gap-2 w-[229px] py-0 px-3'>
      <span className='text-medium-14 dark:text-medium-14-white'>{duration}</span>
    </td>
    <td className='flex items-center gap-2 w-[118px] py-0 px-3'>
      <span className='text-medium-14 dark:text-medium-14-white'>{accessed}</span>
    </td>
  </>
);

// Files Row (shows file, views, accessed)
const FilesRow = ({ file, views, accessed }) => (
  <>
    <td className='flex flex-1 items-center gap-3 py-0 px-3'>
      <FileInfo file={file} />
    </td>
    <td className='flex items-center gap-2 w-[229px] py-0 px-3'>
      <span className='text-medium-14 dark:text-medium-14-white'>{views}</span>
    </td>
    <td className='flex items-center gap-2 w-[118px] py-0 px-3'>
      <span className='text-medium-14 dark:text-medium-14-white'>{accessed}</span>
    </td>
  </>
);

// Text style shared by every plain cell
const CELL_TEXT = 'text-medium-14 dark:text-medium-14-white';

// Neutral badge for an anonymous visitor, showing the short code from its label
export const VisitorBadge = ({ label }) => {
  const code = String(label || '').split(' ')[1] || '';

  return (
    <div className='flex items-center gap-2 min-w-0'>
      <span
        aria-hidden='true'
        className='flex w-6 h-6 flex-shrink-0 items-center justify-center rounded-full border border-stroke-200 bg-stroke-100 dark:border-neutral-700 dark:bg-neutral-800 text-[10px] font-medium uppercase text-neutral-400 dark:text-neutral-300'
      >
        {code ? code.slice(0, 2) : '?'}
      </span>
      <span className={`${CELL_TEXT} truncate`}>{label}</span>
    </div>
  );
};

// Active transfers are outlined in the primary colour, expired ones are muted
export const StatusBadge = ({ status }) => {
  const isActive = status === 'active';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
        isActive
          ? 'border-primary-500 text-primary-500'
          : 'border-stroke-200 text-neutral-400 dark:border-neutral-700 dark:text-neutral-300'
      }`}
    >
      {isActive ? 'Active' : 'Expired'}
    </span>
  );
};

// Transfer name with a file icon, cut short when it does not fit
const TransferName = ({ transfer }) => (
  <div className='flex items-center gap-3 min-w-0'>
    <span className='flex-shrink-0'>
      <FileIcon />
    </span>
    <span className={`${CELL_TEXT} truncate`} title={transfer.name}>{transfer.name}</span>
  </div>
);

// Activity Row (shows visitor, transfer, event, when)
const ActivityRow = ({ visitor, transfer, event, accessed }) => (
  <>
    <td className={`flex items-center gap-2 py-0 px-3 ${getColumnWidth('activity', 'visitor')}`}>
      <VisitorBadge label={visitor} />
    </td>
    <td className={`flex items-center gap-3 py-0 px-3 ${getColumnWidth('activity', 'transfer')}`}>
      <TransferName transfer={transfer} />
    </td>
    <td className={`flex items-center gap-2 py-0 px-3 ${getColumnWidth('activity', 'event')}`}>
      <span className='flex-shrink-0'>{event.icon}</span>
      <span className={`${CELL_TEXT} truncate`} title={event.label}>{event.label}</span>
    </td>
    <td className={`flex items-center gap-2 py-0 px-3 ${getColumnWidth('activity', 'when')}`}>
      <span className={`${CELL_TEXT} truncate`} title={accessed}>{accessed}</span>
    </td>
  </>
);

// Transfer Row (shows transfer, status, visitors, views, downloads, last activity)
const TransferRow = ({ transfer, status, visitors, views, downloads, lastActivity }) => (
  <>
    <td className={`flex items-center gap-3 py-0 px-3 ${getColumnWidth('transfers', 'transfer')}`}>
      <TransferName transfer={transfer} />
    </td>
    <td className={`flex items-center gap-2 py-0 px-3 ${getColumnWidth('transfers', 'status')}`}>
      <StatusBadge status={status} />
    </td>
    <td className={`flex items-center gap-2 py-0 px-3 ${getColumnWidth('transfers', 'visitors')}`}>
      <span className={`${CELL_TEXT} truncate`}>{visitors}</span>
    </td>
    <td className={`flex items-center gap-2 py-0 px-3 ${getColumnWidth('transfers', 'views')}`}>
      <span className={`${CELL_TEXT} truncate`}>{views}</span>
    </td>
    <td className={`flex items-center gap-2 py-0 px-3 ${getColumnWidth('transfers', 'downloads')}`}>
      <span className={`${CELL_TEXT} truncate`}>{downloads}</span>
    </td>
    <td className={`flex items-center gap-2 py-0 px-3 ${getColumnWidth('transfers', 'lastActivity')}`}>
      <span className={`${CELL_TEXT} truncate`} title={lastActivity}>{lastActivity}</span>
    </td>
  </>
);

const FileTableRow = ({ filterType, className = "", onOpen, ...rowData }) => {
  const isTransfersTab = filterType === 'transfers';

  // Only rows that open something take focus and answer Enter or Space
  const interactiveProps = onOpen
    ? {
        tabIndex: 0,
        onClick: onOpen,
        onKeyDown: (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpen();
          }
        },
      }
    : {};

  return (
    <tr
      className={`flex items-center gap-2 self-stretch h-[52px] py-[13px] px-3 border-x border-transparent ${className} dark:bg-neutral-900 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-gray-50 dark:hover:bg-dark-gradient-hover ${
        onOpen
          ? 'hover:shadow-custom hover:-translate-y-0.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500'
          : ''
      }`}
      {...interactiveProps}
    >
      {isTransfersTab ? (
        <TransferRow {...rowData} />
      ) : (
        <ActivityRow {...rowData} />
      )}
    </tr>
  );
};

export default FileTableRow;