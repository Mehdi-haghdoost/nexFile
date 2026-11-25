import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { FilesIcon, FolderIcon2, NewTaskIcon, PhotoIcon, VideoIcon } from '@/components/ui/icons';
import SharedActionMenu from '@/components/modules/home/shared/SharedActionMenu';
import { getRoleLabel } from '@/utils/sharing/itemPermissions';

const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
const VIDEO_EXT = ['mp4', 'mov', 'avi', 'mkv', 'webm'];

// Pick an icon based on item type / file extension
const getItemIcon = (item) => {
  if (item.type === 'folder') return <FolderIcon2 />;
  if (item.mimeType === 'application/paper') return <NewTaskIcon />;

  const ext = (item.extension || '').toLowerCase();
  if (IMAGE_EXT.includes(ext)) return <PhotoIcon />;
  if (VIDEO_EXT.includes(ext)) return <VideoIcon />;
  return <FilesIcon />;
};

const joinNames = (names) =>
  names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;

// Names up to three recipients, or two and how many more, e.g. "Vera, Ada and 2 others"
export const describeSharedWith = (sharedWith) => {
  const count = sharedWith?.count || 0;
  const names = sharedWith?.names || [];

  if (count === 0) return 'No one';

  // Three names fit when they are everyone; otherwise two leave room for the count
  const shown = names.slice(0, count <= 3 ? 3 : 2);
  const rest = count - shown.length;

  if (shown.length === 0) return count === 1 ? '1 person' : `${count} people`;
  if (rest === 0) return joinNames(shown);

  return `${shown.join(', ')} and ${rest} ${rest === 1 ? 'other' : 'others'}`;
};

// Who added the caller, or who the caller shared with, by tab
const describePeople = (item, tab) =>
  tab === 'by-me' ? describeSharedWith(item.sharedWith) : item.sharedBy?.name || 'Unknown';

// "3 days ago" for the row, with the full date and time kept for hovering
export const describeSharedAt = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return { relative: '—', full: '', iso: undefined };

  return {
    relative: formatDistanceToNow(date, { addSuffix: true }),
    full: format(date, 'MMM d, yyyy, h:mm a'),
    iso: date.toISOString(),
  };
};

const FileRow = ({ file, tab, onChange }) => {
  const { name } = file;

  const icon = getItemIcon(file);
  const people = describePeople(file, tab);
  const peopleLabel = tab === 'by-me' ? 'Shared with' : 'Shared by';
  const permission = getRoleLabel(file.role);
  const sharedAt = describeSharedAt(file.sharedAt);

  return (
    <>
      {/* Desktop view (>= 768px) */}
      <div className='hidden md:flex items-center gap-2 min-h-[52px] py-3 px-3 self-stretch hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors border-b border-stroke-100 dark:border-neutral-800 last:border-b-0'>
        <div className='flex flex-1 items-center gap-3 min-w-0'>

          {/* Name column */}
          <div className='flex flex-1 items-center min-h-[40px] py-0 px-3 gap-3 min-w-0'>
            <span className="flex-shrink-0 w-5 h-5">{icon}</span>
            <h3 dir='auto' title={name} className='text-sm font-medium text-neutral-500 dark:text-white truncate'>{name}</h3>
          </div>

          {/* Shared by or Shared with column */}
          <div className='flex items-center min-h-[40px] w-[160px] lg:w-[200px] py-0 px-3 flex-shrink-0 min-w-0'>
            <span dir='auto' title={people} className='text-sm text-neutral-500 dark:text-white truncate'>{people}</span>
          </div>

          {/* Permission column */}
          <div className='flex items-center min-h-[40px] w-[110px] py-0 px-3 flex-shrink-0'>
            <span className='text-sm text-neutral-500 dark:text-white'>{permission}</span>
          </div>

          {/* Shared column */}
          <div className='flex items-center min-h-[40px] w-[120px] lg:w-[140px] py-0 px-3 flex-shrink-0 min-w-0'>
            <time dateTime={sharedAt.iso} title={sharedAt.full} className='text-sm text-neutral-500 dark:text-white truncate'>
              {sharedAt.relative}
            </time>
          </div>

          {/* Action column */}
          <div className='flex justify-center items-center gap-2 w-[52px] py-0 px-3 flex-shrink-0'>
            <SharedActionMenu item={file} onChange={onChange} />
          </div>
        </div>
      </div>

      {/* Mobile card view (< 768px) */}
      <div className='flex md:hidden flex-col gap-1.5 p-3 border-b border-stroke-200 dark:border-neutral-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors'>
        <div className='flex items-center justify-between gap-2 min-w-0'>
          <div className='flex items-center gap-2 flex-1 min-w-0'>
            <span className="flex-shrink-0 w-4 h-4">{icon}</span>
            <h3 dir='auto' title={name} className='text-sm font-medium text-neutral-500 dark:text-white truncate'>{name}</h3>
          </div>
          <SharedActionMenu item={file} onChange={onChange} />
        </div>
        <p dir='auto' className='text-[11px] sm:text-xs text-neutral-400 dark:text-neutral-300 truncate'>
          {peopleLabel} {people}
        </p>
        <div className='flex items-center justify-between gap-2 text-[11px] sm:text-xs text-neutral-400 dark:text-neutral-300'>
          <span>{permission}</span>
          <time dateTime={sharedAt.iso} title={sharedAt.full}>{sharedAt.relative}</time>
        </div>
      </div>
    </>
  );
};

export default FileRow;