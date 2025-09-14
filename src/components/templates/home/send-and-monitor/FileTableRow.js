import React from 'react';

// User Avatar Component
const UserAvatar = ({ user }) => (
  <div className="flex items-center gap-2">
    <img
      className="w-6 h-6 flex-shrink-0 rounded-full bg-cover bg-center"
      src={user.avatar}
      alt={user.altText}
    />
    <span className='text-medium-14'>{user.name}</span>
  </div>
);

// File Info Component  
const FileInfo = ({ file }) => (
  <div className='flex items-center gap-3'>
    {file.icon}
    <span className='text-medium-14'>{file.name}</span>
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
      <span className='text-medium-14'>{duration}</span>
    </td>
    <td className='flex items-center gap-2 w-[118px] py-0 px-3'>
      <span className='text-medium-14'>{accessed}</span>
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
      <span className='text-medium-14'>{views}</span>
    </td>
    <td className='flex items-center gap-2 w-[118px] py-0 px-3'>
      <span className='text-medium-14'>{accessed}</span>
    </td>
  </>
);

const FileTableRow = ({ filterType, className = "", ...rowData }) => {
  const isViewerTab = filterType !== 'Files';

  return (
    <tr className={`flex items-center gap-2 self-stretch h-[52px] py-[13px] px-3 ${className}`}>
      {isViewerTab ? (
        <ViewerRow {...rowData} />
      ) : (
        <FilesRow {...rowData} />
      )}
    </tr>
  );
};

export default FileTableRow;