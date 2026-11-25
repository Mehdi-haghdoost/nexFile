'use client';
import React, { useState } from 'react';
import FilterButton from '@/components/ui/FilterButton';
import FileRow from './FileRow';
import SortableColumn from '@/components/ui/SortableColumn';
import useSharedFiles from '@/hooks/files/sharedFiles/useSharedFiles';
import {
  sharedFilesTabs,
  sharedFilesFilters,
  sharedFilesTableColumns,
  sharedFilesDefaultOrder,
} from '@/utils/constants/filesSharedConstants';

// What an empty list says, by tab and filter
export const getEmptyMessage = ({ tab, filter, linksUnavailable }) => {
  if (linksUnavailable || filter === 'links') {
    return {
      title: "Public links aren't available yet",
      text: 'For now, share with people directly. The in-app link opens only for people with access.',
    };
  }

  if (filter === 'files' || filter === 'folders') {
    return { title: `No ${filter} here`, text: 'Try another filter to see everything shared' };
  }

  if (tab === 'by-me') {
    return { title: "You haven't shared anything yet", text: 'Files and folders you share with others appear here' };
  }

  return { title: 'Nothing shared with you yet', text: 'Files and folders people share with you appear here' };
};

// Arrow keys, Home and End move between the buttons of one tab row
const handleTabKeys = (e, options, activeId, onSelect) => {
  const index = options.findIndex((option) => option.id === activeId);
  const moves = {
    ArrowRight: (index + 1) % options.length,
    ArrowLeft: (index - 1 + options.length) % options.length,
    Home: 0,
    End: options.length - 1,
  };

  if (!(e.key in moves)) return;
  e.preventDefault();

  const next = moves[e.key];
  onSelect(options[next].id);
  e.currentTarget.querySelectorAll('[role="tab"]')[next]?.focus();
};

const chevron = (
  <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='text-neutral-400 dark:text-neutral-300' />
    </svg>
  </div>
);

const MobileSelect = ({ value, onChange, options, ariaLabel }) => (
  <div className='relative w-full'>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className='w-full h-10 px-3 pr-10 rounded-lg border border-stroke-300 bg-white dark:bg-neutral-800 dark:border-neutral-700 text-sm font-medium text-neutral-500 dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all'
    >
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </select>
    {chevron}
  </div>
);

// A tab without an icon, styled like the filter buttons
const TabButton = ({ label, isActive, onClick }) => (
  <button
    type='button'
    role='tab'
    onClick={onClick}
    aria-selected={isActive}
    tabIndex={isActive ? 0 : -1}
    className={`
      flex shrink-0 items-center justify-center py-1 px-2.5 sm:px-4 self-stretch rounded-lg
      text-[11px] sm:text-sm font-medium text-neutral-500 dark:text-white whitespace-nowrap
      transition-all duration-200 active:scale-95
      ${isActive
        ? 'border border-stroke-200 dark:border-dark-border bg-white dark:bg-dark-gradient shadow-middle'
        : 'border border-transparent hover:bg-gray-50 dark:hover:bg-neutral-800'
      }
    `}
  >
    {label}
  </button>
);

const TabRow = ({ options, activeId, onSelect, ariaLabel, withIcons }) => (
  <nav
    className='hidden sm:flex items-center gap-1 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100 dark:bg-neutral-900 dark:border-neutral-700 w-full overflow-x-auto'
    style={{
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch',
    }}
  >
    <style jsx>{`
      nav::-webkit-scrollbar {
        display: none;
      }
    `}</style>
    <div
      role='tablist'
      aria-label={ariaLabel}
      onKeyDown={(e) => handleTabKeys(e, options, activeId, onSelect)}
      className='flex gap-1 px-0.5 py-0.5 min-w-max'
    >
      {options.map((option) =>
        withIcons ? (
          <FilterButton
            key={option.id}
            icon={option.icon}
            label={option.label}
            ariaLabel={option.label}
            isActive={activeId === option.id}
            onClick={() => onSelect(option.id)}
          />
        ) : (
          <TabButton
            key={option.id}
            label={option.label}
            isActive={activeId === option.id}
            onClick={() => onSelect(option.id)}
          />
        )
      )}
    </div>
  </nav>
);

const SharedFiles = () => {
  const [activeTab, setActiveTab] = useState('with-me');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sort, setSort] = useState({ key: 'sharedAt', direction: sharedFilesDefaultOrder.sharedAt });

  const {
    items,
    total,
    hasMore,
    linksUnavailable,
    isLoading,
    isLoadingMore,
    error,
    loadMoreError,
    loadMore,
    refresh,
    retry,
  } = useSharedFiles({ tab: activeTab, filter: activeFilter, sort: sort.key, order: sort.direction });

  // The active column flips its order; another column starts in its own natural order
  const handleSort = (key) => {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: sharedFilesDefaultOrder[key] || 'asc' }
    );
  };

  const columns = sharedFilesTableColumns.map((column) => ({
    ...column,
    label: column.tabLabels?.[activeTab] || column.label,
  }));

  const emptyMessage = getEmptyMessage({ tab: activeTab, filter: activeFilter, linksUnavailable });

  return (
    <main className='flex flex-1 flex-col items-start py-4 px-4 md:py-6 md:px-8 gap-4 md:gap-6 self-stretch bg-white dark:bg-neutral-900 w-full min-w-0'>
      <section className='flex flex-1 flex-col items-start gap-3 md:gap-5 self-stretch w-full min-w-0'>

        {/* Page header */}
        <header className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 self-stretch w-full'>
          <h1 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white flex-shrink-0'>
            {typeof total === 'number' ? `Shared (${total})` : 'Shared'}
          </h1>
        </header>

        {/* Tabs and filters (mobile dropdowns) */}
        <div className='sm:hidden flex flex-col gap-2 w-full'>
          <MobileSelect value={activeTab} onChange={setActiveTab} options={sharedFilesTabs} ariaLabel='Choose which shared items to show' />
          <MobileSelect value={activeFilter} onChange={setActiveFilter} options={sharedFilesFilters} ariaLabel='Filter shared items' />
        </div>

        {/* Tabs above filters (tablet/desktop buttons) */}
        <TabRow options={sharedFilesTabs} activeId={activeTab} onSelect={setActiveTab} ariaLabel='Shared items' />
        <TabRow options={sharedFilesFilters} activeId={activeFilter} onSelect={setActiveFilter} ariaLabel='Filter shared items' withIcons />

        {/* Files table */}
        <section className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 w-full overflow-hidden min-w-0'>

          {/* Table header (desktop only) */}
          <header className='hidden md:flex items-center gap-2 min-h-[40px] py-3 px-3 self-stretch border-b border-stroke-300 dark:border-neutral-700 bg-stroke-50 dark:bg-neutral-800'>
            <div className='flex flex-1 items-center gap-3 min-w-0'>
              {columns.map((column) => (
                <SortableColumn
                  key={column.id}
                  column={column}
                  sortConfig={sort}
                  onSort={handleSort}
                />
              ))}
            </div>
          </header>

          {/* Table body */}
          <div className='flex flex-col self-stretch w-full min-w-0'>
            {isLoading ? (
              <div role='status' aria-label='Loading shared items' className='flex items-center justify-center py-12 sm:py-16 self-stretch'>
                <div className='w-6 h-6 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin' />
              </div>
            ) : error ? (
              <div className='flex flex-col items-center justify-center py-12 sm:py-16 self-stretch gap-2 px-4 text-center'>
                <h3 className='text-sm sm:text-base font-medium text-red-500'>Failed to load shared files</h3>
                <p className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-300'>{error}</p>
                <button
                  type='button'
                  onClick={retry}
                  className='mt-1 text-xs sm:text-sm font-medium text-primary-500 hover:underline'
                >
                  Try again
                </button>
              </div>
            ) : items.length > 0 ? (
              <>
                {items.map((file) => (
                  <FileRow key={`${file.type}-${file.id}`} file={file} tab={activeTab} onChange={refresh} />
                ))}

                {/* Next page, added under the rows already showing */}
                {(hasMore || loadMoreError) && (
                  <div className='flex flex-col items-center gap-1 py-3 self-stretch border-t border-stroke-100 dark:border-neutral-800'>
                    {loadMoreError && <p className='text-xs text-error-400'>{loadMoreError}</p>}
                    {hasMore && (
                      <button
                        type='button'
                        onClick={loadMore}
                        disabled={isLoadingMore}
                        className='flex h-8 items-center justify-center gap-2 rounded-lg border border-[#ECECEE] bg-white px-4 text-xs sm:text-sm font-medium text-neutral-500 dark:text-white shadow-light dark:bg-dark-gradient dark:shadow-dark-panel dark:border-dark-border hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50'
                      >
                        {isLoadingMore && <div className='w-4 h-4 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin' />}
                        {isLoadingMore ? 'Loading...' : loadMoreError ? 'Try again' : 'Load more'}
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className='flex flex-col items-center justify-center py-12 sm:py-16 self-stretch gap-3 sm:gap-4 px-4'>
                <div className="flex flex-col justify-center items-center w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] p-1 gap-2 rounded-2xl border-2 border-dark-white-70 bg-gradient-to-b from-[#E1E1E5] to-[#AFAFB2] dark:bg-dark-neutral-gradient">
                  <svg xmlns="http://www.w3.org/2000/svg" width="41" height="40" viewBox="0 0 41 40" fill="none" className="w-8 h-8 sm:w-10 sm:h-10">
                    <path d="M23.8334 3.78223V10.6665C23.8334 11.5999 23.8334 12.0666 24.0151 12.4231C24.1749 12.7367 24.4298 12.9917 24.7434 13.1515C25.0999 13.3331 25.5667 13.3331 26.5001 13.3331H33.3843M23.8334 28.333H13.8334M27.1667 21.6663H13.8334M33.8334 16.6467V28.6663C33.8334 31.4666 33.8334 32.8667 33.2884 33.9363C32.8091 34.8771 32.0442 35.642 31.1034 36.1214C30.0338 36.6663 28.6337 36.6663 25.8334 36.6663H15.1667C12.3665 36.6663 10.9664 36.6663 9.8968 36.1214C8.95599 35.642 8.19108 34.8771 7.71172 33.9363C7.16675 32.8667 7.16675 31.4666 7.16675 28.6663V11.333C7.16675 8.53275 7.16675 7.13261 7.71172 6.06306C8.19108 5.12225 8.95599 4.35734 9.8968 3.87798C10.9664 3.33301 12.3665 3.33301 15.1667 3.33301H20.5197C21.7427 3.33301 22.3541 3.33301 22.9296 3.47116C23.4398 3.59364 23.9275 3.79566 24.3748 4.06981C24.8794 4.37902 25.3118 4.8114 26.1766 5.67615L31.4903 10.9899C32.355 11.8546 32.7874 12.287 33.0966 12.7916C33.3708 13.2389 33.5728 13.7267 33.6953 14.2368C33.8334 14.8123 33.8334 15.4238 33.8334 16.6467Z" stroke="#F6F6F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Each tab and filter says what is missing in its own words */}
                <div className='flex flex-col items-center gap-1 text-center px-2'>
                  <h3 className='text-sm sm:text-base font-medium text-neutral-500 dark:text-neutral-300'>
                    {emptyMessage.title}
                  </h3>
                  <p className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-400'>
                    {emptyMessage.text}
                  </p>
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