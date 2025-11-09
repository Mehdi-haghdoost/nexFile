import React from 'react';

const FileRow = ({ file }) => {
  const { icon, name, date, time } = file;

  const handleActionClick = () => {
    console.log(`Action clicked for: ${name}`);
  };

  return (
    <div className='flex items-center gap-2 h-[52px] py-[13px] px-3 self-stretch'>
      <div className='flex flex-1 items-center gap-3'>
        <div className='flex flex-1 items-center h-10 py-0 px-3 gap-3'>
          {icon}
          <h3 className='text-medium-14 dark:text-medium-14-white'>{name}</h3>
        </div>
        <div className='flex items-center h-10 w-[150px] py-0 px-3 gap-3'>
          <h3 className='text-medium-14 dark:text-medium-14-white'>{date}</h3>
        </div>
        <div className='flex items-center h-10 w-[150px] py-0 px-3 gap-3'>
          <h3 className='text-medium-14 dark:text-medium-14-white'>{time}</h3>
        </div>
        <div className='flex justify-center items-center gap-2 w-[52px] py-0 px-3 '>
          <button
            className='flex items-center justify-center w-8 h-8 p-1 gap-2.5 shadow-custom border border-[#F2F2F3] bg-white rounded cursor-pointer hover:bg-gray-50 transition-colors dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel'
            onClick={handleActionClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="4" height="12" viewBox="0 0 4 12" fill="none">
              <path d="M3.33337 1.33333C3.33337 0.6 2.73337 0 2.00004 0C1.26671 0 0.666708 0.6 0.666708 1.33333C0.666708 2.06667 1.26671 2.66667 2.00004 2.66667C2.73337 2.66667 3.33337 2.06667 3.33337 1.33333Z"
                fill="#2E2E37"
                className='dark:fill-[#737379]'
              />
              <path d="M3.33337 10.6666C3.33337 9.93325 2.73337 9.33325 2.00004 9.33325C1.26671 9.33325 0.666708 9.93325 0.666708 10.6666C0.666708 11.3999 1.26671 11.9999 2.00004 11.9999C2.73337 11.9999 3.33337 11.3999 3.33337 10.6666Z"
                fill="#2E2E37"
                className='dark:fill-[#737379]'
              />
              <path d="M3.33337 6.00008C3.33337 5.26675 2.73337 4.66675 2.00004 4.66675C1.26671 4.66675 0.666708 5.26675 0.666708 6.00008C0.666708 6.73341 1.26671 7.33341 2.00004 7.33341C2.73337 7.33341 3.33337 6.73341 3.33337 6.00008Z"
                fill="#2E2E37"
                className='dark:fill-[#737379]'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileRow;