// src/components/templates/home/file-requests/RequestForFiles.js
import React from 'react';
import { SortIcon } from '@/components/ui/icons';
import { useFileRequests } from '@/hooks/fileRequests/useFileRequests';
import FileRow from './FileRow';
import EmptyState from './EmptyState';

const RequestForFiles = () => {
  const {
    files,
    error,
    activeFilter,
    setActiveFilter,
    sortConfig,
    handleSort,
    handleNewRequest,
    handleActionClick,
    refetch
  } = useFileRequests();

  // Error state
  if (error) {
    return (
      <main className='flex flex-1 flex-col items-start gap-5 self-stretch'>
        <div className='flex flex-1 justify-center items-center py-12'>
          <div className='flex flex-col items-center gap-4 text-center'>
            <div className='p-3 rounded-full bg-red-100'>
              <svg className='w-6 h-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
              </svg>
            </div>
            <div>
              <h3 className='text-medium-16 text-gray-900 mb-2'>Failed to load file requests</h3>
              <p className='text-regular-14 text-gray-600 mb-4'>{error?.message || 'An unexpected error occurred'}</p>
              <button
                onClick={refetch}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Filter options - moved from data.js to here since it's simple
  const filterOptions = [
    { label: 'All', value: 'All' },
    { label: 'Opened', value: 'Opened' },
    { label: 'Closed', value: 'Closed' }
  ];

  return (
    <main className='flex flex-1 flex-col items-start gap-5 self-stretch'>
      {/* File List Header */}
      <header className='flex justify-between items-center self-stretch'>
        <h1 className='text-medium-18 dark:text-medium-18-white'>Request for files</h1>
        <button
          type="button"
          className='flex justify-center items-center gap-1.5 h-8 py-[13px] px-[14px] rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light text-medium-14 dark:text-medium-14-white hover:bg-gray-50 dark:hover:bg-dark-gradient-hover transition-colors'
          aria-label="Create new request"
          onClick={handleNewRequest}
        >
          New request
        </button>
      </header>

      {/* Filter Navigation */}
      <nav className='flex justify-center items-center gap-1 rounded-lg border border-stroke-300 bg-stroke-100 p-0.5 h-8 w-[350px] dark:bg-neutral-900 dark:border-neutral-700' role="tablist">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={activeFilter === option.value}
            className={`flex flex-1 justify-center items-center gap-1.5 py-1 px-[14px] self-stretch outline-none ${activeFilter === option.value
              ? 'rounded-lg border border-stroke-200 bg-white shadow-middle transform scale-[1.02] dark:bg-dark-gradient dark:border-dark-border'
              : 'hover:bg-white/50 dark:hover:bg-transparent'
              }`}
            onClick={() => setActiveFilter(option.value)}
          >
            <span className={`text-medium-14 dark:text-medium-14-white ${activeFilter === option.value ? 'text-gray-900' : 'text-gray-600'
              }`}>
              {option.label}
            </span>
          </button>
        ))}
      </nav>

      {files.length > 0 ? (
        // جدول فایل‌ها
        <section className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700'>
          {/* سربرگ جدول */}
          <header className='flex items-center gap-3 h-10 py-2.5 px-3 self-stretch border-b border-stroke-300 dark:border-neutral-700 bg-stroke-50 dark:bg-neutral-800'>
            <div className='flex flex-1 items-center gap-3'>
              <div
                className='flex flex-1 justify-between items-center h-full cursor-pointer px-3 outline-none'
                onClick={() => handleSort('name')}
              >
                <h3 className='text-regular-14'>Name</h3>
                <SortIcon isActive={sortConfig.key === 'name'} direction={sortConfig.direction} />
              </div>
              <div
                className='flex justify-between items-center w-[150px] h-full cursor-pointer px-3 outline-none'
                onClick={() => handleSort('created')}
              >
                <h3 className='text-regular-14'>Created</h3>
                <SortIcon isActive={sortConfig.key === 'created'} direction={sortConfig.direction} />
              </div>
              <div
                className='flex justify-between items-center w-[150px] h-full cursor-pointer px-3 outline-none'
                onClick={() => handleSort('expiration')}
              >
                <h3 className='text-regular-14'>Expiration</h3>
                <SortIcon isActive={sortConfig.key === 'expiration'} direction={sortConfig.direction} />
              </div>
              <div
                className='flex justify-between items-center w-[150px] h-full cursor-pointer px-3 outline-none'
                onClick={() => handleSort('submitters')}
              >
                <h3 className='text-regular-14'>Submitters</h3>
                <SortIcon isActive={sortConfig.key === 'submitters'} direction={sortConfig.direction} />
              </div>
              <div
                className='flex justify-between items-center w-[150px] h-full cursor-pointer px-3 outline-none'
                onClick={() => handleSort('uploads')}
              >
                <h3 className='text-regular-14'>Uploads</h3>
                <SortIcon isActive={sortConfig.key === 'uploads'} direction={sortConfig.direction} />
              </div>
              <div className='flex justify-between items-center w-[52px] h-full px-3'>
                <h3 className='text-regular-14'>Action</h3>
              </div>
            </div>
          </header>

          {/* محتوای جدول */}
          <div className='flex flex-col self-stretch'>
            {files.map((file) => (
              <FileRow key={file.id} file={file} onActionClick={handleActionClick} />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState />
      )}
    </main>
  );
};

export default RequestForFiles;