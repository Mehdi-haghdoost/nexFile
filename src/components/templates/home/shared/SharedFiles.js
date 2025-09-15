import { CopyLinkIcon, DrawIcon, FileIcon, FolderIcon, FoldersIcon, SortIcon, ViewerIcon } from '@/components/ui/icons';
import React, { useState, useMemo } from 'react';
import FilterButton from './FilterButton';
import FileRow from './FileRow';
import useSorting from '@/hooks/useSorting';

const SharedFiles = () => {
  const [activeFilter, setActiveFilter] = useState('recent');

    // داده‌های نمونه برای تست
  const allFiles = [
    {
      id: 1,
      name: "File.pdf",
      icon: <FileIcon />,
      date: "22/12/2024",
      time: "02:30 PM",
      type: "file"
    },
    {
      id: 2,
      name: "Word.pdf", 
      icon: <FileIcon />,
      date: "21/12/2024",
      time: "01:15 PM",
      type: "file"
    },
    {
      id: 3,
      name: "Illustrator Design",
      icon: <FolderIcon />,
      date: "20/12/2024",
      time: "10:30 AM",
      type: "folder"
    },
    {
      id: 4,
      name: "Campaign Design",
      icon: <FolderIcon />,
      date: "19/12/2024",
      time: "03:45 PM",
      type: "folder"
    },
    {
      id: 5,
      name: "Presentation.pdf",
      icon: <FileIcon />,
      date: "18/12/2024", 
      time: "11:20 AM",
      type: "file"
    },
    {
      id: 6,
      name: "Marketing Assets",
      icon: <FolderIcon />,
      date: "17/12/2024",
      time: "09:15 AM", 
      type: "folder"
    }
  ];

  // فیلتر کردن فایل‌ها بر اساس انتخاب کاربر
  const filteredFiles = useMemo(() => {
    switch (activeFilter) {
      case 'files':
        return allFiles.filter(file => file.type === 'file');
      case 'folders':
        return allFiles.filter(file => file.type === 'folder');
      case 'links':
        return []; // فعلاً خالی
      case 'requests':
        return []; // فعلاً خالی
      case 'recent':
      default:
        return allFiles;
    }
  }, [activeFilter]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    console.log('Filter changed to:', filter);
  };

  // استفاده از hook
  const { sortedData: sortedFiles, handleSort } = useSorting(filteredFiles);

  return (
    <main className='flex flex-1 flex-col items-start py-6 px-8 gap-6 self-stretch bg-white'>
      <section className='flex flex-1 flex-col items-start gap-5 self-stretch'>
        
        {/* بالای صفحه */}
        <header className='flex justify-between items-center self-stretch'>
          <h1 className='text-medium-18'>Shared ({sortedFiles.length})</h1>
          <button className='flex justify-center items-center gap-1.5 h-8 py-[13px] px-[14px] rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 text-center'>
            Create shared folder
          </button>
        </header>

        {/* دکمه‌های فیلتر */}
        <nav className='flex justify-center items-center gap-1 h-8 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100'>
          <FilterButton
            icon={<ViewerIcon />}
            label="Recent"
            isActive={activeFilter === 'recent'}
            onClick={() => handleFilterChange('recent')}
          />
          <FilterButton
            icon={<FoldersIcon />}
            label="Folders"
            isActive={activeFilter === 'folders'}
            onClick={() => handleFilterChange('folders')}
          />
          <FilterButton
            icon={<FileIcon />}
            label="Files"
            isActive={activeFilter === 'files'}
            onClick={() => handleFilterChange('files')}
          />
          <FilterButton
            icon={<CopyLinkIcon />}
            label="Links"
            isActive={activeFilter === 'links'}
            onClick={() => handleFilterChange('links')}
          />
          <FilterButton
            icon={<DrawIcon />}
            label="Request a Sign"
            isActive={activeFilter === 'requests'}
            onClick={() => handleFilterChange('requests')}
          />
        </nav>

        {/* جدول فایل‌ها */}
        <section className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200'>
          
          {/* سربرگ جدول */}
          <header className='flex items-center gap-2 h-10 py-[13px] px-3 self-stretch border-b border-stroke-300 bg-stroke-50'>
            <div className='flex flex-1 items-center gap-3'>
              <div 
                className='flex flex-1 justify-between items-center h-[22px] py-0 px-3 cursor-pointer'
                onClick={() => handleSort('name')}
              >
                <h3 className='text-regular-14'>Name</h3>
                <SortIcon />
              </div>
              <div 
                className='flex justify-between items-center w-[150px] py-0 px-3 self-stretch cursor-pointer'
                onClick={() => handleSort('date')}
              >
                <h3 className='text-regular-14'>Date</h3>
                <SortIcon />
              </div>
              <div 
                className='flex justify-between items-center w-[150px] py-0 px-3 self-stretch cursor-pointer'
                onClick={() => handleSort('time')}
              >
                <h3 className='text-regular-14'>Time</h3>
                <SortIcon />
              </div>
              <div className='flex justify-between items-center w-[52px] py-0 px-3 self-stretch'>
                <h3 className='text-regular-14'>Action</h3>
              </div>
            </div>
          </header>

          {/* محتوای جدول */}
          <div className='flex flex-col self-stretch'>
            {sortedFiles.length > 0 ? (
              sortedFiles.map((file) => (
                <FileRow key={file.id} file={file} />
              ))
            ) : (
              <div className='flex flex-col items-center justify-center py-16 self-stretch gap-4'>
                <div className="flex flex-col justify-center items-center w-[72px] h-[72px] p-1 gap-2 rounded-2xl border-2 border-[rgba(255,255,255,0.70)] bg-gradient-to-b from-[#E1E1E5] to-[#AFAFB2]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="41" height="40" viewBox="0 0 41 40" fill="none">
                    <path d="M23.8334 3.78223V10.6665C23.8334 11.5999 23.8334 12.0666 24.0151 12.4231C24.1749 12.7367 24.4298 12.9917 24.7434 13.1515C25.0999 13.3331 25.5667 13.3331 26.5001 13.3331H33.3843M23.8334 28.333H13.8334M27.1667 21.6663H13.8334M33.8334 16.6467V28.6663C33.8334 31.4666 33.8334 32.8667 33.2884 33.9363C32.8091 34.8771 32.0442 35.642 31.1034 36.1214C30.0338 36.6663 28.6337 36.6663 25.8334 36.6663H15.1667C12.3665 36.6663 10.9664 36.6663 9.8968 36.1214C8.95599 35.642 8.19108 34.8771 7.71172 33.9363C7.16675 32.8667 7.16675 31.4666 7.16675 28.6663V11.333C7.16675 8.53275 7.16675 7.13261 7.71172 6.06306C8.19108 5.12225 8.95599 4.35734 9.8968 3.87798C10.9664 3.33301 12.3665 3.33301 15.1667 3.33301H20.5197C21.7427 3.33301 22.3541 3.33301 22.9296 3.47116C23.4398 3.59364 23.9275 3.79566 24.3748 4.06981C24.8794 4.37902 25.3118 4.8114 26.1766 5.67615L31.4903 10.9899C32.355 11.8546 32.7874 12.287 33.0966 12.7916C33.3708 13.2389 33.5728 13.7267 33.6953 14.2368C33.8334 14.8123 33.8334 15.4238 33.8334 16.6467Z" stroke="#F6F6F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className='flex flex-col items-center gap-1'>
                  <h3 className='text-medium-16'>There were no findings</h3>
                  <p className='text-regular-12'>Your shared files will appear here for easy access</p>
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