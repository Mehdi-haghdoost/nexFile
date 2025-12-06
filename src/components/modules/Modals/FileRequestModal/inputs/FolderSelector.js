'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FolderIcon } from '@/components/ui/icons';

const FolderSelector = ({ folders = [], selectedFolder, onSelectFolder }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentFolder = selectedFolder || folders[0];

  // بستن دراپ‌داون با کلیک خارج از آن
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleSelect = (folder) => {
    onSelectFolder(folder);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const folderName = currentFolder?.name || 'No Folder Selected';
  const ownerPath = currentFolder?.path || '';
  const ownerName = ownerPath.split('/')[0] || 'No Owner';
  const hasFolders = folders && folders.length > 0;

  return (
    <section className='flex flex-col items-start gap-2 self-stretch' ref={dropdownRef}>
      <h2 className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-300'>Folder for file uploads</h2>

      <div className='flex flex-col self-stretch relative'>
        {/* باکس انتخاب پوشه فعلی */}
        <div className='flex items-center justify-between gap-2 sm:gap-3 min-h-[48px] sm:h-[52px] py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border border-stroke-500 dark:border-neutral-600 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer'>
          <div className='flex items-center gap-2 sm:gap-3 flex-1 min-w-0'>
            <div className="flex-shrink-0">
              <FolderIcon staticColor={true} />
            </div>
            <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-1 min-w-0'>
              <span className='text-sm font-medium text-neutral-500 dark:text-white truncate'>{folderName}</span>
              {ownerName !== 'No Owner' && (
                <div className='flex items-center gap-2'>
                  <span className='hidden sm:inline text-sm text-neutral-300 dark:text-neutral-300' aria-hidden="true">•</span>
                  <span className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-300'>{ownerName}</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={toggleDropdown}
            disabled={!hasFolders}
            className={`flex-shrink-0 text-xs sm:text-sm font-medium text-primary-500 transition-colors flex items-center gap-1 ${
              hasFolders
                ? 'hover:text-primary-600 cursor-pointer'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="hidden sm:inline">{hasFolders ? 'Change folder' : 'No folders'}</span>
            <span className="sm:hidden">{hasFolders ? 'Change' : 'None'}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* دراپ‌داون */}
        {isDropdownOpen && hasFolders && (
          <div className='absolute top-full z-20 w-full mt-2 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-200 dark:border-dark-border max-h-60 custom-scrollbar overflow-y-auto'>
            {folders.map((folder, index) => {
              const isSelected = folder.id === currentFolder?.id;
              const folderOwner = folder.path?.split('/')[0] || 'Unknown';

              return (
                <button
                  key={folder.id || index}
                  type="button"
                  onClick={() => handleSelect(folder)}
                  className={`flex items-center w-full text-left py-2.5 sm:py-3 px-3 sm:px-4 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                    isSelected ? 'bg-gray-50 dark:bg-neutral-800/50' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    <FolderIcon />
                  </div>
                  <div className='flex flex-col ml-2 sm:ml-3 flex-1 min-w-0'>
                    <span className='text-sm text-neutral-300 dark:text-neutral-300 truncate'>{folder.name}</span>
                    {folderOwner !== 'Unknown' && (
                      <span className='text-xs text-gray-500 dark:text-gray-400 truncate'>{folderOwner}</span>
                    )}
                  </div>

                  {isSelected && (
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-300 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FolderSelector;