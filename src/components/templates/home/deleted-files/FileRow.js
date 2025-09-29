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
    <li className='flex items-center gap-2 h-[52px] py-[13px] px-5 self-stretch'>
      <div className='flex flex-1 items-center gap-2'>
        <input 
          type="checkbox" 
          className='w-[18px] h-[18px] cursor-pointer'
          aria-label={`Select ${file.name}`}
          checked={isSelected}
          onChange={() => onSelect(file.id)}
        />
        <div className='flex flex-1 items-center gap-4 py-1 px-3'>
          {getFileIcon(file.type)}
          <div className='flex flex-col justify-center items-start gap-0.5'>
            <h3 className='text-medium-14'>{file.name}</h3>
            <nav className='flex items-start gap-1' aria-label="File location">
              <span className='text-regular-12'>{file.folder}</span>
              <ChevronRightIcon aria-hidden="true" />
              <span className='text-regular-12'>{file.category}</span>
            </nav>
          </div>
        </div>
        <div className='flex items-center gap-3 w-[150px] py-0 px-3 self-stretch'>
          <time className='text-regular-14-neutral-500'>{file.deletedTime}</time>
        </div>
      </div>
    </li>
  )
}

export default FileRow