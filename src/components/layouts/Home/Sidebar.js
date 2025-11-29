'use client';
import { useState } from 'react';
import styles from './sidebar.module.css';
import SidebarHeader from './SidebarHeader';
import NavigationMenu from './NavigationMenu';
import RecentlyOpenedSection from './RecentlyOpenedSection';
import StorageWidget from './StorageWidget';
import Navbar from './Navbar';

const Sidebar = ({ onSidebarChange, activeSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigationClick = (key) => {
    onSidebarChange(key);
    // بستن منو بعد از کلیک در موبایل
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* دکمه همبرگر - فقط موبایل */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-60 left-2 z-50 p-2 rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-lg"
        aria-label="منو"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className="text-neutral-500 dark:text-white"
        >
          {isMobileMenuOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Overlay برای موبایل */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className='flex'>
        {/* Navbar - همیشه نمایش داده میشه */}
        <Navbar />

        {/* Sidebar اصلی */}
        <nav className={`
          flex flex-col min-h-screen items-start px-4 py-4 lg:px-6 lg:py-6 
          flex-shrink-0 gap-6 lg:gap-8 
          border-r border-l border-gray-200 dark:border-neutral-500 
          bg-white dark:bg-neutral-900
          transition-transform duration-300 ease-in-out
          w-60 lg:w-[267px]
          
         
          ${isMobileMenuOpen 
            ? 'fixed right-0 top-0 bottom-0 z-40 translate-x-0' 
            : 'fixed right-0 top-0 bottom-0 z-40 translate-x-full'
          }
          
          md:static md:translate-x-0
        `}>
          {/* Header */}
          <SidebarHeader />

          {/* محتوای اصلی Sidebar */}
          <div className='flex flex-col items-start self-stretch flex-1 gap-4 overflow-y-auto custom-scrollbar'>
            {/* NavigationMenu - حتماً باید باشه */}
            <NavigationMenu
              onSidebarChange={handleNavigationClick}
              activeSection={activeSection}
            />

            {/* خط جداکننده */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full" height="2" viewBox="0 0 219 2" fill="none">
              <path 
                d="M0 1H219" 
                stroke="#F2F2F3" 
                className="dark:stroke-[#19191E]"
              />
            </svg>

            {/* Recently Opened */}
            <RecentlyOpenedSection />
          </div>

          {/* Storage Widget */}
          <StorageWidget />
        </nav>
      </div>
    </>
  );
};

export default Sidebar;