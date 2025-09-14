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
    <tr className="flex items-center justify-center py-8">
      <td colSpan="4" className="text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-regular-14 text-neutral-400">
            No {filterType.toLowerCase()} found
          </span>
        </div>
      </td>
    </tr>
  </tbody>
);

const FileTable = ({ filterType, viewerFiles = viewerData, filesFiles = filesData }) => {
  // Get appropriate data based on filter type
  const getTableData = () => {
    return filterType === 'Files' ? filesFiles : viewerFiles;
  };

  const tableData = getTableData();

  return (
    <div className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200'>
      <table 
        className="w-full" 
        role="table"
        aria-label={`${filterType} data table`}
      >
        <FileTableHeader filterType={filterType} />
        
        {tableData.length > 0 ? (
          <tbody>
            {tableData.map((item, index) => (
              <FileTableRow
                key={item.id}
                filterType={filterType}
                {...item}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
              />
            ))}
          </tbody>
        ) : (
          <EmptyState filterType={filterType} />
        )}
      </table>
    </div>
  );
};

export default FileTable;