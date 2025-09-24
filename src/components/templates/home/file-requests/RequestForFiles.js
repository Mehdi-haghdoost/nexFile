import React, { useState } from 'react';
import { SortIcon } from '@/components/ui/icons';
import useModalStore from '@/store/modalStore';
import useSorting from '@/hooks/useSorting';
import FileRow from '@/components/templates/home/file-requests/FileRow';
import EmptyState from '@/components/templates/home/file-requests/EmptyState';
import { mockFiles, filterOptions } from '@/components/templates/home/file-requests/data';

const RequestForFiles = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const { openModal } = useModalStore();

  const { sortedData: files, handleSort, sortConfig } = useSorting(mockFiles, { key: 'name', direction: 'asc' });

  const handleNewRequest = () => {
    openModal('fileRequest');
  };

  const handleActionClick = (fileId) => {
    console.log(`Action clicked for file: ${fileId}`);
  };

  return (
    <main className='flex flex-1 flex-col items-start gap-5 self-stretch'>
      {/* File List Header */}
      <header className='flex justify-between items-center self-stretch'>
        <h1 className='text-medium-18'>Request for files</h1>
        <button
          type="button"
          className='flex justify-center items-center gap-1.5 h-8 py-[13px] px-[14px] rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 hover:bg-gray-50 transition-colors'
          aria-label="Create new request"
          onClick={handleNewRequest}
        >
          New request
        </button>
      </header>

      {/* Filter Navigation - بدون کادر آبی */}
      <nav className='flex justify-center items-center gap-1 rounded-lg border border-stroke-300 bg-stroke-100 p-0.5 h-8 w-[350px]' role="tablist">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={activeFilter === option.value}
            className={`flex flex-1 justify-center items-center gap-1.5 py-1 px-[14px] self-stretch transition-all duration-300 ease-in-out outline-none ${
              activeFilter === option.value
                ? 'rounded-lg border border-stroke-200 bg-white shadow-middle transform scale-[1.02]'
                : 'hover:bg-white/50'
            }`}
            onClick={() => setActiveFilter(option.value)}
          >
            <span className={`text-medium-14 transition-colors duration-300 ${
              activeFilter === option.value ? 'text-gray-900' : 'text-gray-600'
            }`}>
              {option.label}
            </span>
          </button>
        ))}
      </nav>

      {files.length > 0 ? (
        // جدول فایل‌ها
        <section className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200'>
          {/* سربرگ جدول - بدون کادر آبی */}
          <header className='flex items-center gap-3 h-10 py-2.5 px-3 self-stretch border-b border-stroke-300 bg-stroke-50'>
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