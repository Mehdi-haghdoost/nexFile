import React from 'react';
import { FileIcon } from '@/components/ui/icons';

const TableCell = ({ children, width, className = "" }) => (
  <td className={`flex items-center gap-2 py-0 px-3 ${width} ${className}`}>
    {children}
  </td>
);

const UserAvatar = ({ src, alt, name }) => (
  <div className="flex items-center gap-2">
    <img
      className="w-6 h-6 flex-shrink-0 rounded-full bg-cover bg-center"
      src={src}
      alt={alt}
      loading="lazy"
    />
    <span className='text-medium-14'>{name}</span>
  </div>
);

const FileInfo = ({ fileName, icon = <FileIcon /> }) => (
  <div className="flex items-center gap-3">
    {icon}
    <span className='text-medium-14'>{fileName}</span>
  </div>
);

// Row for Viewer tab
const ViewerRow = ({ user, file, duration, accessed }) => (
  <>
    <TableCell width="w-[300px]">
      <UserAvatar 
        src={user.avatar}
        alt={user.altText}
        name={user.name}
      />
    </TableCell>
    
    <TableCell width="flex-1">
      <FileInfo fileName={file.name} icon={file.icon} />
    </TableCell>
    
    <TableCell width="w-[229px]">
      <span className='text-medium-14'>{duration}</span>
    </TableCell>
    
    <TableCell width="w-[118px]">
      <span className='text-medium-14'>{accessed}</span>
    </TableCell>
  </>
);

// Row for Files tab
const FilesRow = ({ file, views, accessed }) => (
  <>
    <TableCell width="flex-1">
      <FileInfo fileName={file.name} icon={file.icon} />
    </TableCell>
    
    <TableCell width="w-[229px]">
      <span className='text-medium-14'>{views}</span>
    </TableCell>
    
    <TableCell width="w-[118px]">
      <span className='text-medium-14'>{accessed}</span>
    </TableCell>
  </>
);

const FileTableRow = ({ 
  id,
  filterType,
  user, 
  file,
  duration, 
  views,
  accessed,
  className = ""
}) => {
  return (
    <tr 
      className={`flex items-center gap-2 self-stretch h-[52px] py-[13px] px-3 ${className}`}
      role="row"
    >
      <td className='flex flex-1 items-center gap-3'>
        {filterType === 'Files' ? (
          <FilesRow 
            file={file}
            views={views}
            accessed={accessed}
          />
        ) : (
          <ViewerRow 
            user={user}
            file={file}
            duration={duration}
            accessed={accessed}
          />
        )}
      </td>
    </tr>
  );
};

export default FileTableRow;