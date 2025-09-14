import React from 'react';

const TableHeaderCell = ({ children, width, className = "" }) => (
  <th 
    className={`flex items-center gap-2 py-0 px-3 ${width} ${className}`}
    scope="col"
  >
    <span className='text-regular-14'>{children}</span>
  </th>
);

const FileTableHeader = ({ filterType }) => {
  const getColumns = () => {
    if (filterType === 'Files') {
      return [
        { id: 'filename', label: 'File name', width: 'flex-1' },
        { id: 'views', label: 'Views', width: 'w-[229px]' },
        { id: 'accessed', label: 'Accessed', width: 'w-[118px]' }
      ];
    }
    
    // Default columns for Viewer tab
    return [
      { id: 'name', label: 'Name', width: 'w-[300px]' },
      { id: 'filename', label: 'File name', width: 'flex-1' },
      { id: 'duration', label: 'Duration', width: 'w-[229px]' },
      { id: 'accessed', label: 'Accessed', width: 'w-[118px]' }
    ];
  };

  const columns = getColumns();

  return (
    <thead>
      <tr className='flex items-center gap-2 py-[13px] px-3 h-10 self-stretch border border-stroke-300 bg-stroke-100'>
        <th className='flex flex-1 items-center gap-3' scope="col">
          <div className='flex items-center gap-3 flex-1'>
            {columns.map((column) => (
              <TableHeaderCell 
                key={column.id}
                width={column.width}
              >
                {column.label}
              </TableHeaderCell>
            ))}
          </div>
        </th>
      </tr>
    </thead>
  );
};

export default FileTableHeader;