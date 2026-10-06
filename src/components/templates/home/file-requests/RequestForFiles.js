'use client';
import React from 'react';
import { useFileRequests } from '@/hooks/files/fileRequests/useFileRequests';
import SortableColumn from '@/components/ui/SortableColumn';
import { AlertTriangleIcon } from '@/components/ui/icons';
import FileRow from './FileRow';
import EmptyState from './EmptyState';
import { FILE_REQUEST_COLUMNS, FILE_REQUEST_FILTERS } from '@/utils/constants/fileRequestConstants';

const RequestForFiles = () => {
  const {
    files,
    isLoading,
    error,
    activeFilter,
    setActiveFilter,
    sortConfig,
    handleSort,
    handleNewRequest,
    toggleStatus,
    deleteRequest,
    refetch,
  } = useFileRequests();

  if (error) {
    return (
      <main className='flex flex-1 flex-col items-center justify-center gap-4 self-stretch py-12 text-center w-full'>
        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-error-400/10'>
          <AlertTriangleIcon size={24} />
        </div>
        <div className='flex flex-col items-center gap-2'>
          <h3 className='text-sm sm:text-base font-medium text-neutral-500 dark:text-white'>
            Failed to load file requests
          </h3>
          <p className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-400'>
            {error?.message || 'An unexpected error occurred'}
          </p>
        </div>
        <button
          onClick={refetch}
          className='h-9 rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] px-5 text-sm font-medium text-white shadow-light transition-all hover:shadow-md active:scale-95'
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className='flex flex-1 flex-col items-start gap-3 md:gap-5 self-stretch w-full min-w-0'>
      {/* File list header */}
      <header className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 self-stretch w-full'>
        <h1 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white flex-shrink-0'>
          Request for files
        </h1>
        <button
          type="button"
          onClick={handleNewRequest}
          className='flex justify-center items-center gap-1.5 h-8 py-[13px] px-3 sm:px-[14px] rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light text-xs sm:text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 active:scale-95 transition-all w-full sm:w-auto flex-shrink-0'
        >
          New request
        </button>
      </header>

      {/* Mobile filter dropdown (below 640px) */}
      <div className='sm:hidden relative w-full'>
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          aria-label='Filter requests by status'
          className='w-full h-10 px-3 pr-10 rounded-lg border border-stroke-300 bg-white dark:bg-neutral-800 dark:border-neutral-700 text-sm font-medium text-neutral-500 dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all'
        >
          {FILE_REQUEST_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Positioned against the select itself, not a fixed offset down the page */}
        <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2'>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='text-neutral-400 dark:text-neutral-300' />
          </svg>
        </span>
      </div>

      {/* Filter buttons for tablet and up */}
      <nav
        role='tablist'
        className='hidden sm:flex justify-center items-center gap-1 rounded-lg border border-stroke-300 bg-stroke-100 p-0.5 h-8 w-full max-w-[350px] dark:bg-neutral-900 dark:border-neutral-700'
      >
        {FILE_REQUEST_FILTERS.map((option) => {
          const isActive = activeFilter === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveFilter(option.value)}
              className={`
                flex flex-1 items-center justify-center gap-1.5 self-stretch rounded-lg py-1 px-[14px] outline-none
                text-xs sm:text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'border border-stroke-200 bg-white shadow-middle text-neutral-500 dark:bg-dark-gradient dark:border-dark-border dark:text-white'
                  : 'border border-transparent text-neutral-400 hover:bg-white/50 dark:text-neutral-300 dark:hover:bg-neutral-800'
                }
              `}
            >
              {option.label}
            </button>
          );
        })}
      </nav>

      {isLoading ? (
        <div className='flex items-center justify-center w-full py-16'>
          <div className='w-6 h-6 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin' />
        </div>
      ) : files.length > 0 ? (
        <section className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 w-full overflow-hidden min-w-0'>

          {/* Table header, desktop only */}
          <header className='hidden lg:flex items-center gap-3 min-h-[40px] py-3 px-3 self-stretch border-b border-stroke-300 dark:border-neutral-700 bg-stroke-50 dark:bg-neutral-800'>
            <div className='flex flex-1 items-center gap-3 min-w-0'>
              {FILE_REQUEST_COLUMNS.map((column) => (
                <SortableColumn
                  key={column.id}
                  column={column}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
              ))}
            </div>
          </header>

          <div className='flex flex-col self-stretch w-full min-w-0'>
            {files.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                onToggleStatus={toggleStatus}
                onDelete={deleteRequest}
              />
            ))}
          </div>
        </section>
      ) : (
        /* A filter matching nothing is a different state from having no requests */
        <EmptyState isFiltered={activeFilter !== 'All'} filterLabel={activeFilter} />
      )}
    </main>
  );
};

export default RequestForFiles;