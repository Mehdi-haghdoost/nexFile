import React from 'react';
import { SortIcon } from '@/components/ui/icons';
import { useFileRequests } from '@/hooks/files/fileRequests/useFileRequests';
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
      <main className='flex flex-1 flex-col items-start gap-3 md:gap-5 self-stretch w-full min-w-0'>
        <div className='flex flex-1 justify-center items-center py-12'>
          <div className='flex flex-col items-center gap-4 text-center px-4'>
            <div className='p-3 rounded-full bg-red-100 dark:bg-red-900/20'>
              <svg className='w-6 h-6 text-red-600 dark:text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
              </svg>
            </div>
            <div>
              <h3 className='text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-2'>Failed to load file requests</h3>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4'>{error?.message || 'An unexpected error occurred'}</p>
              <button
                onClick={refetch}
                className='px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all'
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Filter options
  const filterOptions = [
    { label: 'All', value: 'All' },
    { label: 'Opened', value: 'Opened' },
    { label: 'Closed', value: 'Closed' }
  ];

  return (
    <main className='flex flex-1 flex-col items-start gap-3 md:gap-5 self-stretch w-full min-w-0'>
      {/* File List Header */}
      <header className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 self-stretch w-full'>
        <h1 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white flex-shrink-0'>
          Request for files
        </h1>
        <button
          type="button"
          className='flex justify-center items-center gap-1.5 h-8 py-[13px] px-3 sm:px-[14px] rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light text-xs sm:text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-dark-gradient-hover active:scale-95 transition-all w-full sm:w-auto flex-shrink-0'
          aria-label="Create new request"
          onClick={handleNewRequest}
        >
          New request
        </button>
      </header>

      {/* Filter Navigation */}
      
      {/* نمایش Dropdown در موبایل (زیر 640px) */}
      <div className='sm:hidden w-full'>
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className='w-full h-10 px-3 pr-10 rounded-lg border border-stroke-300 bg-white dark:bg-neutral-800 dark:border-neutral-700 text-sm font-medium text-neutral-500 dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all'
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className='absolute right-7 top-[138px] pointer-events-none'>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='text-neutral-400 dark:text-neutral-300'/>
          </svg>
        </div>
      </div>

      {/* نمایش دکمه‌ها در تبلت و دسکتاپ (640px به بالا) */}
      <nav className='hidden sm:flex justify-center items-center gap-1 rounded-lg border border-stroke-300 bg-stroke-100 p-0.5 h-8 w-full max-w-[350px] dark:bg-neutral-900 dark:border-neutral-700' role="tablist">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={activeFilter === option.value}
            className={`flex flex-1 justify-center items-center gap-1.5 py-1 px-[14px] self-stretch outline-none rounded-lg transition-[border,box-shadow,transform,color,opacity] ${
              activeFilter === option.value
                ? 'border border-stroke-200 bg-white shadow-middle transform scale-[1.02] dark:bg-dark-gradient dark:border-dark-border'
                : 'hover:bg-white/50 dark:hover:bg-neutral-800'
            }`}
            onClick={() => setActiveFilter(option.value)}
          >
            <span className={`text-xs sm:text-sm font-medium dark:text-white ${
              activeFilter === option.value ? 'text-gray-900' : 'text-gray-600'
            }`}>
              {option.label}
            </span>
          </button>
        ))}
      </nav>

      {files.length > 0 ? (
        // جدول فایل‌ها
        <section className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 w-full overflow-hidden min-w-0'>
          
          {/* سربرگ جدول - فقط دسکتاپ */}
          <header className='hidden lg:flex items-center gap-3 min-h-[40px] py-3 px-3 self-stretch border-b border-stroke-300 dark:border-neutral-700 bg-stroke-50 dark:bg-neutral-800'>
            <div className='flex flex-1 items-center gap-3 min-w-0'>
              <div
                className='flex flex-1 min-w-0 justify-between items-center h-full cursor-pointer px-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors'
                onClick={() => handleSort('name')}
              >
                <h3 className='text-sm text-neutral-300 dark:text-neutral-300'>Name</h3>
                <SortIcon isActive={sortConfig.key === 'name'} direction={sortConfig.direction} />
              </div>
              <div
                className='flex justify-between items-center w-[120px] lg:w-[150px] flex-shrink-0 h-full cursor-pointer px-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors'
                onClick={() => handleSort('created')}
              >
                <h3 className='text-sm text-neutral-300 dark:text-neutral-300'>Created</h3>
                <SortIcon isActive={sortConfig.key === 'created'} direction={sortConfig.direction} />
              </div>
              <div
                className='flex justify-between items-center w-[120px] lg:w-[150px] flex-shrink-0 h-full cursor-pointer px-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors'
                onClick={() => handleSort('expiration')}
              >
                <h3 className='text-sm text-neutral-300 dark:text-neutral-300'>Expiration</h3>
                <SortIcon isActive={sortConfig.key === 'expiration'} direction={sortConfig.direction} />
              </div>
              <div
                className='flex justify-between items-center w-[100px] lg:w-[120px] flex-shrink-0 h-full cursor-pointer px-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors'
                onClick={() => handleSort('submitters')}
              >
                <h3 className='text-sm text-neutral-300 dark:text-neutral-300'>Submitters</h3>
                <SortIcon isActive={sortConfig.key === 'submitters'} direction={sortConfig.direction} />
              </div>
              <div
                className='flex justify-between items-center w-[100px] lg:w-[120px] flex-shrink-0 h-full cursor-pointer px-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors'
                onClick={() => handleSort('uploads')}
              >
                <h3 className='text-sm text-neutral-300 dark:text-neutral-300'>Uploads</h3>
                <SortIcon isActive={sortConfig.key === 'uploads'} direction={sortConfig.direction} />
              </div>
              <div className='flex justify-between items-center w-[52px] flex-shrink-0 h-full px-3'>
                <h3 className='text-sm text-neutral-300 dark:text-neutral-300'>Action</h3>
              </div>
            </div>
          </header>

          {/* محتوای جدول */}
          <div className='flex flex-col self-stretch w-full min-w-0'>
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