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
    <>
      {/* Desktop View */}
      <li className='hidden md:flex items-center gap-2 min-h-[52px] py-3 px-4 md:px-5 self-stretch w-full border-b border-stroke-200 dark:border-neutral-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors'>
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
        
        {/* نام فایل و آیکون */}
        <div className='flex items-center gap-3 md:gap-4 py-1 px-3 flex-1 min-w-0'>
          <div className='flex-shrink-0'>
            {getFileIcon(file.type)}
          </div>
          <div className='flex flex-col justify-center items-start gap-0.5 min-w-0 flex-1'>
            <h3 className='text-sm font-medium text-neutral-500 dark:text-white truncate w-full'>{file.name}</h3>
            <nav className='flex items-start gap-1' aria-label="File location">
              <span className='text-xs text-neutral-300 dark:text-neutral-300'>{file.folder}</span>
              <ChevronRightIcon aria-hidden="true" />
              <span className='text-xs text-neutral-300 dark:text-neutral-300'>{file.category}</span>
            </nav>
          </div>
        </div>
        
        {/* زمان حذف */}
        <div className='flex items-center justify-end w-[120px] lg:w-[150px] py-0 px-3 flex-shrink-0'>
          <time className='text-sm text-neutral-500 dark:text-white'>{file.deletedTime}</time>
        </div>
      </li>

      {/* Mobile Card View */}
      <li className='flex md:hidden flex-col gap-2 p-3 border-b border-stroke-200 dark:border-neutral-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors'>
        <div className='flex items-start justify-between gap-2 w-full'>
          <div className='flex items-start gap-2 flex-1 min-w-0'>
            <div className='w-[18px] h-[18px] flex-shrink-0 mt-0.5'>
              <input 
                type="checkbox" 
                className='w-full h-full cursor-pointer'
                aria-label={`Select ${file.name}`}
                checked={isSelected}
                onChange={() => onSelect(file.id)}
              />
            </div>
            <div className='flex items-start gap-2 flex-1 min-w-0'>
              <div className='flex-shrink-0 mt-0.5'>
                {getFileIcon(file.type)}
              </div>
              <div className='flex flex-col gap-1 flex-1 min-w-0'>
                <h3 className='text-sm font-medium text-neutral-500 dark:text-white truncate'>{file.name}</h3>
                <nav className='flex items-center gap-1 flex-wrap' aria-label="File location">
                  <span className='text-xs text-neutral-300 dark:text-neutral-300'>{file.folder}</span>
                  <ChevronRightIcon aria-hidden="true" />
                  <span className='text-xs text-neutral-300 dark:text-neutral-300'>{file.category}</span>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div className='flex items-center justify-end pl-6'>
          <time className='text-xs text-neutral-400 dark:text-neutral-400'>{file.deletedTime}</time>
        </div>
      </li>
    </>
  )
}

export default FileRow