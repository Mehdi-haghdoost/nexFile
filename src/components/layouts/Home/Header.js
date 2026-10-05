'use client';

import { useEffect, useRef, useState } from 'react';
import { BellIcon, QuestionIcon, SearchIcon } from '@/components/ui/icons';
import SearchResults from '@/components/modules/search/SearchResults';
import HeaderPopover from '@/components/modules/header/HeaderPopover';
import NoticesPanel from '@/components/modules/header/NoticesPanel';
import HelpPanel from '@/components/modules/header/HelpPanel';
import { useGlobalSearch } from '@/hooks/search/useGlobalSearch';
import { useNotices } from '@/hooks/notices/useNotices';
import { FILES_HELP_TOPICS } from '@/utils/constants/helpTopics';
import styles from './header.module.css';

const Header = () => {
  const [term, setTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  const { results, isSearching } = useGlobalSearch(term);
  const { notices, isLoading, unreadCount, seenAt, markAllSeen } = useNotices();

  // Field and dropdown share one container, so clicking a result is never an outside click
  useEffect(() => {
    if (!isFocused) return;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsFocused(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFocused]);

  const handleSelect = () => {
    setTerm('');
    setIsFocused(false);
  };

  const isDropdownOpen = isFocused && term.trim().length >= 2;

  return (
    <div className='flex items-center justify-between self-stretch py-4 px-4 md:py-5 md:px-8 border-b border-stroke-200 bg-white dark:bg-neutral-900 dark:border-neutral-800'>

      {/* Search */}
      <div ref={containerRef} className='relative flex-1 max-w-md'>
        <div className='flex items-center gap-2.5'>
          <span className='header-search-icon shrink-0'>
            <SearchIcon />
          </span>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            aria-label="Search your folders and files"
            placeholder='What are you looking for?'
            className='text-sm dark:bg-neutral-900 text-neutral-500 dark:text-white outline-0 w-full placeholder:text-neutral-300 dark:placeholder:text-neutral-400'
          />

          {term && (
            <button
              onClick={() => setTerm('')}
              aria-label="Clear search"
              className='shrink-0 rounded p-0.5 text-neutral-300 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800'
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {isDropdownOpen && (
          <SearchResults
            results={results}
            isSearching={isSearching}
            term={term.trim()}
            onSelect={handleSelect}
          />
        )}
      </div>

      {/* Right-hand actions */}
      <div className='flex items-center justify-center gap-2 md:gap-3'>
        {/* Opening the panel marks everything in it read */}
        <HeaderPopover
          label='Activity'
          badgeCount={unreadCount}
          onOpen={markAllSeen}
          icon={<BellIcon />}
        >
          <NoticesPanel notices={notices} isLoading={isLoading} seenAt={seenAt} />
        </HeaderPopover>

        <HeaderPopover label='How NexFile works' icon={<QuestionIcon />}>
          <HelpPanel title='How NexFile works' topics={FILES_HELP_TOPICS} />
        </HeaderPopover>
      </div>
    </div>
  );
};

export default Header;