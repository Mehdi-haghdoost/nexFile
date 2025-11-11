import { PhotoIcon, VideoIcon, ChevronRightIcon } from '@/components/ui/icons'
import React from 'react'

const FileRow = ({ file, isSelected, onSelect }) => {
  const getFileIcon = (type) => {
    switch (type) {
      case 'photo':
        return <PhotoIcon aria-hidden="true" />
      case 'video':
        return <VideoIcon aria-hidden="true" />
      default:
        return <PhotoIcon aria-hidden="true" />
    }
  }

  return (
    <li className='flex items-center gap-2 h-[52px] py-[13px] px-5 self-stretch w-full'>
      {/* چک‌باکس */}
      <div className='w-[18px] h-[18px] flex-shrink-0'>
        <input 
          type="checkbox" 
          className='w-full h-full cursor-pointer'
          aria-label={`Select ${file.name}`}
          checked={isSelected}
          onChange={() => onSelect(file.id)}
        />
      </div>
      
      {/* نام فایل و آیکون - با flex-1 */}
      <div className='flex items-center gap-4 py-1 px-3 flex-1 min-w-0'>
        {getFileIcon(file.type)}
        <div className='flex flex-col justify-center items-start gap-0.5 min-w-0 flex-1'>
          <h3 className='text-medium-14 dark:text-medium-14-white truncate w-full'>{file.name}</h3>
          <nav className='flex items-start gap-1' aria-label="File location">
            <span className='text-regular-12 dark:text-regular-12-neutral-300'>{file.folder}</span>
            <ChevronRightIcon aria-hidden="true" />
            <span className='text-regular-12 dark:text-regular-12-neutral-300'>{file.category}</span>
          </nav>
        </div>
      </div>
      
      {/* زمان حذف - با عرض ثابت */}
      <div className='flex items-center justify-end w-[150px] py-0 px-3 flex-shrink-0'>
        <time className='text-regular-14-neutral-500 dark:text-regular-14-white'>{file.deletedTime}</time>
      </div>
    </li>
  )
}

export default FileRow