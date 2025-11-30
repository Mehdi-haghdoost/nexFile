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
    // بستن منو بعد از کلیک در موبایل و تبلت (زیر 1024px)
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* دکمه همبرگر - تا 1024px */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed left-0 top-60 z-50 p-2.5 rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Toggle menu"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral-500 dark:text-white transition-transform duration-200"
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

      {/* Overlay برای موبایل و تبلت */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeInOverlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className='flex'>
        {/* Navbar - همیشه نمایش داده می‌شود */}
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
            ? 'fixed right-0 top-0 bottom-0 z-50 translate-x-0 shadow-2xl' 
            : 'fixed right-0 top-0 bottom-0 z-50 translate-x-full'
          }
          
          lg:static lg:translate-x-0 lg:shadow-none
        `}>
          {/* دکمه بستن داخل Sidebar - فقط موبایل و تبلت */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden absolute top-4 left-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-500 dark:text-white"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Header */}
          <SidebarHeader />

          {/* محتوای اصلی Sidebar */}
          <div className='flex flex-col items-start self-stretch flex-1 gap-4 overflow-y-auto custom-scrollbar'>
            {/* NavigationMenu */}
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