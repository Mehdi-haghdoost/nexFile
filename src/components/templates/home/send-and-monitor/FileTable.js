import React from 'react';
import { FileIcon } from '@/components/ui/icons';
import FileTableHeader from './FileTableHeader';
import FileTableRow from './FileTableRow';

// Sample data for Viewer tab
const viewerData = [
  {
    id: 1,
    user: {
      name: "Adrian Carter",
      avatar: "/images/adrian.png",
      altText: "آواتار Adrian Carter"
    },
    file: {
      name: "File.pdf",
      icon: <FileIcon />
    },
    duration: "9m 32s",
    accessed: "12h ago"
  },
  {
    id: 2,
    user: {
      name: "Bella Thompson",
      avatar: "/images/bella.png",
      altText: "آواتار Bella Thompson"
    },
    file: {
      name: "Word.pdf",
      icon: <FileIcon />
    },
    duration: "5m 18s",
    accessed: "3h ago"
  }
];

// Sample data for Files tab
const filesData = [
  {
    id: 1,
    file: {
      name: "File.pdf",
      icon: <FileIcon />
    },
    views: "1 person",
    accessed: "12h ago"
  },
  {
    id: 2,
    file: {
      name: "Word.pdf",
      icon: <FileIcon />
    },
    views: "1 person",
    accessed: "3h ago"
  }
];

const EmptyState = ({ filterType }) => (
  <tbody>
    <tr className="h-16">
      <td colSpan="4" className="text-center py-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-neutral-400 dark:text-neutral-300">
            No {filterType.toLowerCase()} found
          </span>
        </div>
      </td>
    </tr>
  </tbody>
);

const FileTable = ({ filterType = 'Viewer' }) => {
  // Get appropriate data based on filterType
  const data = filterType === 'Files' ? filesData : viewerData;

  return (
    <div className='flex flex-1 flex-col items-start self-stretch w-full'>
      {/* Desktop Table View - نمایش از 768px به بالا */}
      <div className='hidden md:flex flex-col w-full rounded-lg border border-stroke-200 dark:border-neutral-700 overflow-hidden'>
        <div className='w-full overflow-x-auto'>
          {/* min-width برای tablet: 500px, برای desktop: 800px */}
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

      {/* Mobile Card View - نمایش زیر 768px */}
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
              No {filterType.toLowerCase()} found
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileTable;