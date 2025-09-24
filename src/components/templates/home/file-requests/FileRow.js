import React, { memo } from 'react';

const FileRow = memo(({ file, onActionClick }) => (
  <div className='flex items-center gap-3 px-3 py-2 self-stretch border-b border-stroke-300 hover:bg-gray-50 transition-colors'>
    <div className='flex flex-1 items-center gap-3'>
      {/* Name */}
      <div className='flex flex-1 items-center h-[22px] py-0 px-3'>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M10.5 1.70215V4.80005C10.5 5.22009 10.5 5.43011 10.5817 5.59055C10.6537 5.73167 10.7684 5.8464 10.9095 5.91831C11.0699 6.00005 11.28 6.00005 11.7 6.00005H14.7979M10.5 12.75H6M12 9.75H6M15 7.49117V12.9C15 14.1601 15 14.7902 14.7548 15.2715C14.539 15.6948 14.1948 16.039 13.7715 16.2548C13.2902 16.5 12.6601 16.5 11.4 16.5H6.6C5.33988 16.5 4.70982 16.5 4.22852 16.2548C3.80516 16.039 3.46095 15.6948 3.24524 15.2715C3 14.7902 3 14.1601 3 12.9V5.1C3 3.83988 3 3.20982 3.24524 2.72852C3.46095 2.30516 3.80516 1.96095 4.22852 1.74524C4.70982 1.5 5.33988 1.5 6.6 1.5H9.00883C9.55916 1.5 9.83432 1.5 10.0933 1.56217C10.3229 1.61729 10.5423 1.7082 10.7436 1.83156C10.9707 1.9707 11.1653 2.16527 11.5544 2.55442L13.9456 4.94558C14.3347 5.33473 14.5293 5.5293 14.6684 5.75636C14.7918 5.95767 14.8827 6.17715 14.9378 6.40673C15 6.66568 15 6.94084 15 7.49117Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className='text-regular-14 ml-1'>{file.name}</h3>
      </div>
      {/* Created */}
      <div className='flex justify-between items-center w-[150px] py-0 px-3 self-stretch'>
        <h3 className='text-regular-14'>{file.created}</h3>
      </div>
      {/* Expiration */}
      <div className='flex justify-between items-center w-[150px] py-0 px-3 self-stretch'>
        <h3 className='text-regular-14'>{file.expiration}</h3>
      </div>
      {/* Submitters */}
      <div className='flex justify-between items-center w-[150px] py-0 px-3 self-stretch'>
        <h3 className='text-regular-14'>{file.submitters}</h3>
      </div>
      {/* Uploads */}
      <div className='flex justify-between items-center w-[150px] py-0 px-3 self-stretch'>
        <h3 className='text-regular-14'>{file.uploads}</h3>
      </div>
      {/* Action */}
      <div className='flex justify-between items-center w-[52px] py-0 px-3 self-stretch'>
        <button
          className='flex items-center justify-center w-8 h-8 p-1 gap-2.5 shadow-custom border border-[#F2F2F3] bg-white rounded cursor-pointer hover:bg-gray-50 transition-colors'
          onClick={() => onActionClick(file.id)}
          aria-label={`Actions for ${file.name}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="4" height="12" viewBox="0 0 4 12" fill="none">
            <path d="M3.33337 1.33333C3.33337 0.6 2.73337 0 2.00004 0C1.26671 0 0.666708 0.6 0.666708 1.33333C0.666708 2.06667 1.26671 2.66667 2.00004 2.66667C2.73337 2.66667 3.33337 2.06667 3.33337 1.33333Z" fill="#2E2E37" />
            <path d="M3.33337 10.6666C3.33337 9.93325 2.73337 9.33325 2.00004 9.33325C1.26671 9.33325 0.666708 9.93325 0.666708 10.6666C0.666708 11.3999 1.26671 11.9999 2.00004 11.9999C2.73337 11.9999 3.33337 11.3999 3.33337 10.6666Z" fill="#2E2E37" />
            <path d="M3.33337 6.00008C3.33337 5.26675 2.73337 4.66675 2.00004 4.66675C1.26671 4.66675 0.666708 5.26675 0.666708 6.00008C0.666708 6.73341 1.26671 7.33341 2.00004 7.33341C2.73337 7.33341 3.33337 6.73341 3.33337 6.00008Z" fill="#2E2E37" />
          </svg>
        </button>
      </div>
    </div>
  </div>
));

FileRow.displayName = 'FileRow';
export default FileRow;