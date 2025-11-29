'use client';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useDropdownStore from '@/store/ui/dropdownStore';

const MoreDropdownPortal = ({ buttons, onItemClick }) => {
  const dropdownRef = useRef(null);
  const { isMoreDropdownOpen, moreDropdownPosition, closeMoreDropdown } = useDropdownStore();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeMoreDropdown();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeMoreDropdown();
      }
    };

    if (isMoreDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMoreDropdownOpen, closeMoreDropdown]);

  if (!isMoreDropdownOpen || !moreDropdownPosition) return null;

  const dropdown = (
    <div
      ref={dropdownRef}
      className='fixed bg-white dark:bg-neutral-800 border border-stroke-300 dark:border-neutral-600 rounded-lg shadow-dropdown dark:shadow-dark-dropdown z-[100] py-2 min-w-[200px]'
      style={{
        top: `${moreDropdownPosition.top}px`,
        left: `${moreDropdownPosition.left}px`,
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={() => {
            onItemClick(button.id);
            closeMoreDropdown();
          }}
          className='flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors text-left'
        >
          <div className='flex items-center justify-center shrink-0'>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
              {button.icon}
            </svg>
          </div>
          <span className='text-sm text-neutral-500 dark:text-white'>
            {button.title}
          </span>
        </button>
      ))}
    </div>
  );

  return createPortal(dropdown, document.body);
};

export default MoreDropdownPortal;