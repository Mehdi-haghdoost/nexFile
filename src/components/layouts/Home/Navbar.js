'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './sidebar.module.css';
import MoreDropdown from '@/components/modules/home/moreDropdown/MoreDropdown';
import { NAVBAR_LOGO, NAVBAR_ITEMS, NAVBAR_ICONS } from '@/utils/constants/navbarConstants';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('home');
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    if (pathname === '/home') {
      setActiveItem('home');
    } else if (pathname === '/folder') {
      setActiveItem('folder');
    }
  }, [pathname]);

  const handleNavigation = (itemId) => {
    if (itemId === 'more') {
      setIsMoreDropdownOpen(!isMoreDropdownOpen);
      setActiveItem('more');
    } else {
      setActiveItem(itemId);
      setIsMoreDropdownOpen(false);
      if (itemId === 'home') {
        router.push('/home');
      } else if (itemId === 'folder') {
        router.push('/folder');
      }
    }
  };

  const handleCloseDropdown = () => {
    setIsMoreDropdownOpen(false);
  };

  return (
    <nav 
      ref={navbarRef}
      className={`
        flex flex-col items-center justify-between min-h-screen py-4 lg:py-6 
        border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 
        relative transition-all duration-300 ease-in-out overflow-hidden z-40
        ${isExpanded ? 'w-48 px-4' : 'w-14 lg:w-16 px-2'}
      `}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className='flex flex-col items-start gap-6 w-full'>
        {/* Logo */}
        <div className={`flex items-center gap-3 transition-all duration-300 ${isExpanded ? 'w-full justify-start' : 'w-10 justify-center'}`}>
          <div className={styles.logomark}>
            {NAVBAR_LOGO}
          </div>
          {isExpanded && (
            <span className="text-medium-14 text-gray-700 dark:text-white whitespace-nowrap">
              NexFile
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <ul className='flex flex-col items-start gap-4 w-full relative'>
          {NAVBAR_ITEMS.map((item) => (
            <li
              key={item.id}
              className={`
                flex items-center gap-3 rounded-lg cursor-pointer relative 
                transition-all duration-200 w-full p-2
                ${activeItem === item.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
                }
              `}
              onClick={() => handleNavigation(item.id)}
              onMouseEnter={(e) => e.stopPropagation()}
            >
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                {item.icon}
              </div>
              
              {/* Animated Text */}
              <div className={`
                transition-all duration-300 overflow-hidden
                ${isExpanded ? 'max-w-32 opacity-100' : 'max-w-0 opacity-0'}
              `}>
                <h3 className={`
                  whitespace-nowrap text-regular-14
                  ${activeItem === item.id 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-neutral-200'
                  }
                `}>
                  {item.label}
                </h3>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* فضای خالی برای تراز کردن محتوا - چیزی نمایش داده نمیشه */}
      <div className="w-full h-10"></div>
      
      {/* خط آبی کناری - فقط وقتی active هست نمایش داده بشه */}
      {activeItem && (
        <div className='absolute w-0 h-10 right-0 top-[88px] z-30'>
          {NAVBAR_ICONS.BLUE_LINE}
        </div>
      )}

      {/* Dropdown برای More */}
      {isMoreDropdownOpen && (
        <MoreDropdown onClose={handleCloseDropdown} />
      )}
    </nav>
  );
};

export default Navbar;