import React from 'react';
import { FilesIcon, FolderIcon2, PhotoIcon, VideoIcon } from '@/components/ui/icons';
import SharedActionMenu from '@/components/modules/home/shared/SharedActionMenu';

const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
const VIDEO_EXT = ['mp4', 'mov', 'avi', 'mkv', 'webm'];

// Pick an icon based on item type / file extension
const getItemIcon = (item) => {
  if (item.type === 'folder') return <FolderIcon2 />;

  const ext = (item.extension || '').toLowerCase();
  if (IMAGE_EXT.includes(ext)) return <PhotoIcon />;
  if (VIDEO_EXT.includes(ext)) return <VideoIcon />;
  return <FilesIcon />;
};

const FileRow = ({ file }) => {
  const { name, date, time, sharedByName } = file;

  const icon = getItemIcon(file);

  return (
    <>
      {/* Desktop view (>= 768px) */}
      <div className='hidden md:flex items-center gap-2 min-h-[52px] py-3 px-3 self-stretch hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors border-b border-stroke-100 dark:border-neutral-800 last:border-b-0'>
        <div className='flex flex-1 items-center gap-3 min-w-0'>

          {/* Name column */}
          <div className='flex flex-1 items-center min-h-[40px] py-0 px-3 gap-3 min-w-0'>
            <span className="flex-shrink-0 w-5 h-5">{icon}</span>
            <div className='flex flex-col min-w-0'>
              <h3 className='text-sm font-medium text-neutral-500 dark:text-white truncate'>{name}</h3>
              {sharedByName && (
                <span className='text-[11px] text-neutral-300 dark:text-neutral-400 truncate'>
                  Shared by {sharedByName}
                </span>
              )}
            </div>
          </div>

          {/* Date column */}
          <div className='flex items-center min-h-[40px] w-[120px] lg:w-[150px] py-0 px-3 gap-3 flex-shrink-0'>
            <h3 className='text-sm font-medium text-neutral-500 dark:text-white'>{date}</h3>
          </div>

          {/* Time column */}
          <div className='flex items-center min-h-[40px] w-[100px] lg:w-[150px] py-0 px-3 gap-3 flex-shrink-0'>
            <h3 className='text-sm font-medium text-neutral-500 dark:text-white'>{time}</h3>
          </div>

          {/* Action column */}
          <div className='flex justify-center items-center gap-2 w-[52px] py-0 px-3 flex-shrink-0'>
            <SharedActionMenu item={file} />
          </div>
        </div>
      </div>

      {/* Mobile card view (< 768px) */}
      <div className='flex md:hidden flex-col gap-2 p-3 border-b border-stroke-200 dark:border-neutral-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors'>
        <div className='flex items-center justify-between gap-2 min-w-0'>
          <div className='flex items-center gap-2 flex-1 min-w-0'>
            <span className="flex-shrink-0 w-4 h-4">{icon}</span>
            <div className='flex flex-col min-w-0'>
              <h3 className='text-sm font-medium text-neutral-500 dark:text-white truncate'>{name}</h3>
              {sharedByName && (
                <span className='text-[11px] text-neutral-300 dark:text-neutral-400 truncate'>
                  Shared by {sharedByName}
                </span>
              )}
            </div>
          </div>
          <SharedActionMenu item={file} />
        </div>
        <div className='flex items-center justify-between text-[11px] sm:text-xs text-neutral-400 dark:text-neutral-300'>
          <span>{date}</span>
          <span>{time}</span>
        </div>
      </div>
    </>
  );
};

export default FileRow;