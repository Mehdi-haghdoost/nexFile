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
      <h2 className='text-regular-12-neutral-300'>Folder for file uploads</h2>
      
      <div className='flex flex-col self-stretch relative'>
        {/* باکس انتخاب پوشه فعلی */}
        <div className='flex items-center justify-between gap-3 h-[52px] py-3 px-4 rounded-lg border border-stroke-500 bg-white hover:bg-gray-50 transition-colors cursor-pointer'>
          <div className='flex items-center gap-3'>
            <FolderIcon />
            <div className='flex items-center gap-2'>
              <span className='text-medium-14'>{folderName}</span>
              {ownerName !== 'No Owner' && (
                <>
                  <span className='text-regular-14' aria-hidden="true">•</span>
                  <span className='text-regular-14'>{ownerName}</span>
                </>
              )}
            </div>
          </div>
          
          <button
            type="button"
            onClick={toggleDropdown}
            disabled={!hasFolders}
            className={`text-right text-medium-12-primary transition-colors flex items-center gap-1 ${
              hasFolders 
                ? 'hover:text-primary-600 cursor-pointer' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            {hasFolders ? 'Change folder' : 'No folders available'}
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

        {/* دراپ‌داون ساده */}
        {isDropdownOpen && hasFolders && (
          <div className='absolute top-full z-20 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto'>
            {folders.map((folder, index) => {
              const isSelected = folder.id === currentFolder?.id;
              const folderOwner = folder.path?.split('/')[0] || 'Unknown';
              
              return (
                <button
                  key={folder.id || index}
                  type="button"
                  onClick={() => handleSelect(folder)}
                  className={`flex items-center w-full text-left py-3 px-4 hover:bg-gray-100 transition-colors duration-150 ${
                    isSelected ? 'bg-gray-50' : ''
                  }`}
                >
                  <FolderIcon />
                  <div className='flex flex-col ml-3'>
                    <span className='text-regular-14'>{folder.name}</span>
                    {folderOwner !== 'Unknown' && (
                      <span className='text-xs text-gray-500'>{folderOwner}</span>
                    )}
                  </div>
                  
                  {isSelected && (
                    <svg className="w-4 h-4 text-gray-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
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