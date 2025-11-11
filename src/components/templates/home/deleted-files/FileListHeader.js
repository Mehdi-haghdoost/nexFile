import React from 'react'

const FileListHeader = () => {
  return (
    <header className='flex items-center gap-2 self-stretch h-10 py-[13px] px-5 border-b border-stroke-300 dark:border-neutral-700 bg-[#FCFCFC] dark:bg-neutral-800'>
      {/* چک‌باکس */}
      <div className='w-[18px] h-[18px] flex-shrink-0' aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" stroke="#EAEAEB" 
          className='dark:stroke-[#58585F]'
          />
        </svg>
      </div>
      
      {/* نام - با flex-1 */}
      <div className='flex items-center gap-2 py-0 px-3 flex-1 min-w-0'>
        <h2 className='text-regular-14 dark:text-regular-14-neutral-300'>Name</h2>
      </div>
      
      {/* زمان حذف - با عرض ثابت */}
      <div className='flex items-center justify-end w-[150px] py-0 px-3 flex-shrink-0'>
        <h2 className='text-regular-14 dark:text-regular-14-neutral-300'>Deleted</h2>
      </div>
    </header>
  )
}

export default FileListHeader