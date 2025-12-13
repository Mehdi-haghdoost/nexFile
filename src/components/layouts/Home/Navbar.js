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
  const [hoveredItem, setHoveredItem] = useState(null);
  const navbarRef = useRef(null);
  const tooltipTimeoutRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize hover sound
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();

      const playHoverSound = () => {
        try {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = 800;
          oscillator.type = 'sine';

          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.015, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.08);
        } catch (error) {
          console.log('Audio playback failed');
        }
      };

      audioRef.current = playHoverSound;

      return () => {
        audioContext.close();
      };
    } catch (error) {
      console.log('Audio initialization failed');
    }
  }, []);

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

  const handleMouseEnter = (itemId) => {
    if (audioRef.current) {
      audioRef.current();
    }

    tooltipTimeoutRef.current = setTimeout(() => {
      setHoveredItem(itemId);
    }, 250);
  };

  const handleMouseLeave = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setHoveredItem(null);
  };

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  return (
    <nav
      ref={navbarRef}
      className="flex flex-col items-center justify-between min-h-screen py-4 lg:py-6 border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 relative w-14 lg:w-16 px-2 z-[60]"
    >
      <div className='flex flex-col items-center gap-6 w-full'>
        {/* Logo */}
        <div className='flex items-center justify-center w-10'>
          <div className={styles.logomark}>
            {NAVBAR_LOGO}
          </div>
        </div>

        {/* Navigation Items */}
        <ul className='flex flex-col items-center gap-4 w-full relative'>
          {NAVBAR_ITEMS.map((item) => (
            <li
              key={item.id}
              className='relative w-full flex justify-center'
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`
                  flex items-center justify-center rounded-lg cursor-pointer 
                  transition-all duration-300 w-10 h-10 icon-pulse-on-hover
                  ${activeItem === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-lg'
                    : 'hover:bg-gray-50 dark:hover:bg-neutral-800 hover:shadow-md'
                  }
                `}
                onClick={() => handleNavigation(item.id)}
              >
                <div className="w-6 h-6 flex items-center justify-center transition-transform duration-300">
                  {item.icon}
                </div>
              </button>

              {/* Elegant Bubble Tooltip - فلش مستقیم روی آیکون */}
              {hoveredItem === item.id && (
                <div className="absolute left-full top-0 -translate-y-1/2 ml-2 z-[70] pointer-events-none bubble-tooltip-container bubble-tooltip-float">
                  <div className="relative pr-3">
                    {/* SVG Bubble */}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 140 40" 
                      height="52" 
                      width="auto"
                      className="transition-all duration-300"
                      style={{ minWidth: `${item.label.length * 8 + 60}px` }}
                    >
                      <path 
                        d="M33.196 0h94.61C134.56 0 140 5.44 140 12.195v15.61C140 34.56 134.56 40 127.805 40h-94.61C26.44 40 21 34.56 21 27.805v-1.903S18.196 15.427 0 20c17.185-10.084 21-5.902 21-5.902v-1.903C21 5.44 26.44 0 33.196 0z" 
                        className="bubble-svg-path"
                      />
                    </svg>
                    
                    {/* Shimmer Effect */}
                    <div className="bubble-shimmer absolute inset-0 pr-2"></div>
                    
                    {/* Tooltip Text */}
                    <div className="bubble-text absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap px-2">
                      {item.label}
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* فضای خالی */}
      <div className="w-full h-10"></div>

      {/* خط آبی کناری */}
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