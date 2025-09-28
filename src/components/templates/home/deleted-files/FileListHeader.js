import React from 'react'

const FileListHeader = () => {
  return (
    <header className='flex items-center gap-2 self-stretch h-10 py-[13px] px-5 border-b border-stroke-300 bg-[#FCFCFC]'>
      <div className='flex flex-1 items-center gap-3'>
        <div className='w-[18px] h-[18px]' aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" stroke="#EAEAEB" />
          </svg>
        </div>
        <div className='flex flex-1 items-center gap-2 h-[22px] py-0 px-3'>
          <h2 className='text-regular-14'>Name</h2>
        </div>
        <div className='flex items-center gap-2 w-[150px] py-0 px-3 self-stretch'>
          <h2 className='text-regular-14'>Deleted</h2>
        </div>
      </div>
    </header>
  )
}

export default FileListHeader