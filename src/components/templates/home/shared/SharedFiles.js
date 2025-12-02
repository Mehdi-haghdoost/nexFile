import { SortIcon } from '@/components/ui/icons';
import React, { useState, useMemo } from 'react';
import FilterButton from '@/components/modules/home/shared/FilterButton';
import FileRow from './FileRow';
import useSorting from '@/hooks/useSorting';
import { sharedFilesFilters, allSharedFiles, sharedFilesTableColumns } from '@/utils/constants/filesSharedConstants';

const SharedFiles = () => {
  const [activeFilter, setActiveFilter] = useState('recent');

  const filteredFiles = useMemo(() => {
    switch (activeFilter) {
      case 'files':
        return allSharedFiles.filter(file => file.type === 'file');
      case 'folders':
        return allSharedFiles.filter(file => file.type === 'folder');
      case 'links':
        return [];
      case 'requests':
        return [];
      case 'recent':
      default:
        return allSharedFiles;
    }
  }, [activeFilter]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    console.log('Filter changed to:', filter);
  };

  const { sortedData: sortedFiles, handleSort } = useSorting(filteredFiles);

  // پیدا کردن فیلتر فعال برای نمایش در select
  const activeFilterObj = sharedFilesFilters.find(f => f.id === activeFilter);

  return (
    <main className='flex flex-1 flex-col items-start py-4 px-4 md:py-6 md:px-8 gap-4 md:gap-6 self-stretch bg-white dark:bg-neutral-900 w-full min-w-0'>
      <section className='flex flex-1 flex-col items-start gap-3 md:gap-5 self-stretch w-full min-w-0'>

        {/* بالای صفحه */}
        <header className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 self-stretch w-full'>
          <h1 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white flex-shrink-0'>
            Shared ({sortedFiles.length})
          </h1>
          <button className='flex justify-center items-center gap-1.5 h-8 py-[13px] px-3 sm:px-[14px] rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light text-xs sm:text-sm font-medium text-neutral-500 dark:text-white text-center hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap w-full sm:w-auto flex-shrink-0'>
            Create shared folder
          </button>
        </header>

        {/* دکمه‌های فیلتر */}
        
        {/* نمایش Dropdown در موبایل (زیر 640px) */}
        <div className='sm:hidden w-full'>
          <div className='relative w-full'>
            <select
              value={activeFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className='w-full h-10 px-3 pr-10 rounded-lg border border-stroke-300 bg-white dark:bg-neutral-800 dark:border-neutral-700 text-sm font-medium text-neutral-500 dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all'
            >
              {sharedFilesFilters.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.label}
                </option>
              ))}
            </select>
            {/* Custom Arrow Icon */}
            <div className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none'>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='text-neutral-400 dark:text-neutral-300'/>
              </svg>
            </div>
          </div>
        </div>

        {/* نمایش دکمه‌ها در تبلت و دسکتاپ (640px به بالا) */}
        <nav className='hidden sm:flex items-center gap-1 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100 dark:bg-neutral-900 dark:border-neutral-700 w-full overflow-x-auto' 
             style={{ 
               msOverflowStyle: 'none',
               scrollbarWidth: 'none',
               WebkitOverflowScrolling: 'touch'
             }}>
          <style jsx>{`
            nav::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className='flex gap-1 px-0.5 py-0.5 min-w-max'>
            {sharedFilesFilters.map((filter) => (
              <FilterButton
                key={filter.id}
                icon={filter.icon}
                label={filter.label}
                isActive={activeFilter === filter.id}
                onClick={() => handleFilterChange(filter.id)}
              />
            ))}
          </div>
        </nav>

        {/* جدول فایل‌ها */}
        <section className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 w-full overflow-hidden min-w-0'>

          {/* سربرگ جدول - فقط در دسکتاپ */}
          <header className='hidden md:flex items-center gap-2 min-h-[40px] py-3 px-3 self-stretch border-b border-stroke-300 dark:border-neutral-700 bg-stroke-50 dark:bg-neutral-800'>
            <div className='flex flex-1 items-center gap-3 min-w-0'>
              {sharedFilesTableColumns.map((column) => (
                <div
                  key={column.id}
                  className={`flex ${column.width === 'flex-1' ? 'flex-1 min-w-0' : column.width} ${
                    column.sortable ? 'justify-between cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700' : 'justify-between'
                  } items-center min-h-[22px] py-0 px-3 rounded transition-colors flex-shrink-0`}
                  onClick={column.sortable ? () => handleSort(column.id) : undefined}
                >
                  <h3 className='text-sm text-neutral-300 dark:text-neutral-300 flex-shrink-0'>{column.label}</h3>
                  {column.sortable && <SortIcon />}
                </div>
              ))}
            </div>
          </header>

          {/* محتوای جدول */}
          <div className='flex flex-col self-stretch w-full min-w-0'>
            {sortedFiles.length > 0 ? (
              sortedFiles.map((file) => (
                <FileRow key={file.id} file={file} />
              ))
            ) : (
              <div className='flex flex-col items-center justify-center py-12 sm:py-16 self-stretch gap-3 sm:gap-4 px-4'>
                <div className="flex flex-col justify-center items-center w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] p-1 gap-2 rounded-2xl border-2 border-dark-white-70 bg-gradient-to-b from-[#E1E1E5] to-[#AFAFB2] dark:bg-dark-neutral-gradient">
                  <svg xmlns="http://www.w3.org/2000/svg" width="41" height="40" viewBox="0 0 41 40" fill="none" className="w-8 h-8 sm:w-10 sm:h-10">
                    <path d="M23.8334 3.78223V10.6665C23.8334 11.5999 23.8334 12.0666 24.0151 12.4231C24.1749 12.7367 24.4298 12.9917 24.7434 13.1515C25.0999 13.3331 25.5667 13.3331 26.5001 13.3331H33.3843M23.8334 28.333H13.8334M27.1667 21.6663H13.8334M33.8334 16.6467V28.6663C33.8334 31.4666 33.8334 32.8667 33.2884 33.9363C32.8091 34.8771 32.0442 35.642 31.1034 36.1214C30.0338 36.6663 28.6337 36.6663 25.8334 36.6663H15.1667C12.3665 36.6663 10.9664 36.6663 9.8968 36.1214C8.95599 35.642 8.19108 34.8771 7.71172 33.9363C7.16675 32.8667 7.16675 31.4666 7.16675 28.6663V11.333C7.16675 8.53275 7.16675 7.13261 7.71172 6.06306C8.19108 5.12225 8.95599 4.35734 9.8968 3.87798C10.9664 3.33301 12.3665 3.33301 15.1667 3.33301H20.5197C21.7427 3.33301 22.3541 3.33301 22.9296 3.47116C23.4398 3.59364 23.9275 3.79566 24.3748 4.06981C24.8794 4.37902 25.3118 4.8114 26.1766 5.67615L31.4903 10.9899C32.355 11.8546 32.7874 12.287 33.0966 12.7916C33.3708 13.2389 33.5728 13.7267 33.6953 14.2368C33.8334 14.8123 33.8334 15.4238 33.8334 16.6467Z" stroke="#F6F6F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className='flex flex-col items-center gap-1 text-center px-2'>
                  <h3 className='text-sm sm:text-base font-medium text-neutral-500 dark:text-neutral-500'>There were no findings</h3>
                  <p className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-300'>Your shared files will appear here for easy access</p>
                </div>
              </div>
            )}
          </div>

        </section>
      </section>
    </main>
  );
};

export default SharedFiles;