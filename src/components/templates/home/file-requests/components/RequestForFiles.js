import React, { useState } from 'react';
import { DownloadIcon, SortIcon } from '@/components/ui/icons';
import useModalStore from '@/store/modalStore';
import useSorting from '@/hooks/useSorting'; // ایمپورت هوک useSorting

const RequestForFiles = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const { openModal } = useModalStore();


  const mockFiles = [
    { id: '1', name: 'Resume_2025.pdf', created: '2025/09/22', expiration: '2025/10/22', submitters: 3, uploads: 5, time: '10:30 AM' },
    { id: '2', name: 'Project-Brief.docx', created: '2025/09/21', expiration: '2025/10/21', submitters: 1, uploads: 1, time: '02:45 PM' },
    { id: '3', name: 'Marketing_Assets.zip', created: '2025/09/20', expiration: '2025/10/20', submitters: 5, uploads: 12, time: '09:00 AM' },
  ];


  const { sortedData: files, handleSort, sortConfig } = useSorting(mockFiles, { key: 'name', direction: 'asc' });

  const filterOptions = [
    { label: 'All', value: 'All' },
    { label: 'Opened', value: 'Opened' },
    { label: 'Closed', value: 'Closed' }
  ];

  const handleNewRequest = () => {
    openModal('fileRequest');
  };

  const handleActionClick = () => {
    console.log(`Action clicked`);
  };

  const FileRow = ({ file }) => (
    <div className='flex items-center gap-3 px-3 py-2 self-stretch border-b border-stroke-300'>
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
            onClick={handleActionClick}
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
  );

  return (
    <main className='flex flex-1 flex-col items-start gap-5 self-stretch'>
      {/* File List Header */}
      <header className='flex justify-between items-center self-stretch'>
        <h1 className='text-medium-18'>Request for files</h1>
        <button
          type="button"
          className='flex justify-center items-center gap-1.5 h-8 py-[13px] px-[14px] rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14'
          aria-label="Create new request"
          onClick={handleNewRequest}
        >
          New request
        </button>
      </header>

      {/* Filter Navigation */}
      <nav className='flex justify-center items-center gap-1 rounded-lg border border-stroke-300 bg-stroke-100 p-0.5 h-8 w-[350px]' role="tablist">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={activeFilter === option.value}
            className={`flex flex-1 justify-center items-center gap-1.5 py-1 px-[14px] self-stretch transition-all duration-300 ease-in-out ${activeFilter === option.value
              ? 'rounded-lg border border-stroke-200 bg-white shadow-middle transform scale-[1.02]'
              : 'hover:bg-white/50'
              }`}
            onClick={() => setActiveFilter(option.value)}
          >
            <span className={`text-medium-14 transition-colors duration-300 ${activeFilter === option.value ? 'text-gray-900' : 'text-gray-600'
              }`}>
              {option.label}
            </span>
          </button>
        ))}
      </nav>

      {files.length > 0 ? (
        // جدول فایل‌ها
        <section className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200'>
          {/* سربرگ جدول */}
          <header className='flex items-center gap-3 h-10 py-2.5 px-3 self-stretch border-b border-stroke-300 bg-stroke-50'>
            <div className='flex flex-1 items-center gap-3'>
              <div
                className='flex flex-1 justify-between items-center h-full cursor-pointer px-3'
                onClick={() => handleSort('name')}
              >
                <h3 className='text-regular-14'>Name</h3>
                <SortIcon isActive={sortConfig.key === 'name'} direction={sortConfig.direction} />
              </div>
              <div
                className='flex justify-between items-center w-[150px] h-full cursor-pointer px-3'
                onClick={() => handleSort('created')}
              >
                <h3 className='text-regular-14'>Created</h3>
                <SortIcon isActive={sortConfig.key === 'created'} direction={sortConfig.direction} />
              </div>
              <div
                className='flex justify-between items-center w-[150px] h-full cursor-pointer px-3'
                onClick={() => handleSort('expiration')}
              >
                <h3 className='text-regular-14'>Expiration</h3>
                <SortIcon isActive={sortConfig.key === 'expiration'} direction={sortConfig.direction} />
              </div>
              <div
                className='flex justify-between items-center w-[150px] h-full cursor-pointer px-3'
                onClick={() => handleSort('submitters')}
              >
                <h3 className='text-regular-14'>Submitters</h3>
                <SortIcon isActive={sortConfig.key === 'submitters'} direction={sortConfig.direction} />
              </div>
              <div
                className='flex justify-between items-center w-[150px] h-full cursor-pointer px-3'
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
              <FileRow key={file.id} file={file} />
            ))}
          </div>
        </section>
      ) : (
        // Empty State
        <section className='flex flex-1 flex-col justify-center items-center py-4 px-7 self-stretch rounded-lg border-stroke-200 bg-white' aria-labelledby="empty-state-title">
          <div className='flex flex-col justify-center items-center gap-2 p-1 w-[72px] h-[72px] rounded-2xl border-2 border-[rgba(255,255,255,0.70)] bg-gradient-to-b from-[#E1E1E5] to-[#AFAFB2]'>
            <div className='flex items-center justify-center'>
              <DownloadIcon aria-hidden="true" />
            </div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <h2 id="empty-state-title" className='text-medium-16'>There is currently no request file</h2>
            <p className='text-regular-12 text-center w-[500px]'>
              Request files from anyone, with or without a NexFile account, and store them securely in your chosen folder. Files are auto-organized, ensuring privacy.
            </p>
          </div>
        </section>
      )}
    </main>
  );
};

export default RequestForFiles;