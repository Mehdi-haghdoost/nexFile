// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import styles from './sidebar.module.css';
// import MoreDropdown from '@/components/modules/home/moreDropdown/MoreDropdown';
// import { NAVBAR_LOGO, NAVBAR_ITEMS, NAVBAR_ICONS } from '@/utils/constants/navbarConstants';

// const Navbar = () => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [activeItem, setActiveItem] = useState('home');
//   const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const navbarRef = useRef(null);

//   useEffect(() => {
//     if (pathname === '/home') {
//       setActiveItem('home');
//     } else if (pathname === '/folder') {
//       setActiveItem('folder');
//     }
//   }, [pathname]);

//   const handleNavigation = (itemId) => {
//     if (itemId === 'more') {
//       setIsMoreDropdownOpen(!isMoreDropdownOpen);
//       setActiveItem('more');
//     } else {
//       setActiveItem(itemId);
//       setIsMoreDropdownOpen(false);
//       if (itemId === 'home') {
//         router.push('/home');
//       } else if (itemId === 'folder') {
//         router.push('/folder');
//       }
//     }
//   };

//   const handleCloseDropdown = () => {
//     setIsMoreDropdownOpen(false);
//   };

//   // فقط در دسکتاپ expand میشه
//   const handleMouseEnter = () => {
//     // Fix: اضافه کردن typeof check
//     if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
//       setIsExpanded(true);
//     }
//   };

//   const handleMouseLeave = () => {
//     setIsExpanded(false);
//   };

//   return (
//     <nav
//       ref={navbarRef}
//       className={`
//         flex flex-col items-center justify-between min-h-screen py-4 lg:py-6 
//         border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 
//         relative transition-all duration-300 ease-in-out overflow-hidden z-40
//         ${isExpanded ? 'w-40 px-4' : 'w-14 lg:w-16 px-2'}
//       `}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       <div className='flex flex-col items-start gap-6 w-full'>
//         <div className={`flex items-center gap-3 transition-all duration-300 ${isExpanded ? 'w-full justify-start' : 'w-10 justify-center'}`}>
//           <div className={styles.logomark}>
//             {NAVBAR_LOGO}
//           </div>
//           {isExpanded && (
//             <span className="text-medium-14 text-gray-700 dark:text-white whitespace-nowrap">
//               NexFile
//             </span>
//           )}
//         </div>
//         <ul className='flex flex-col items-start gap-4 w-full relative'>
//           {NAVBAR_ITEMS.map((item) => (
//             <li
//               key={item.id}
//               className={`
//                 flex items-center gap-3 rounded-lg cursor-pointer relative 
//                 transition-all duration-200 w-full p-2
//                 ${activeItem === item.id
//                   ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
//                   : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
//                 }
//               `}
//               onClick={() => handleNavigation(item.id)}
//               onMouseEnter={(e) => e.stopPropagation()}
//             >
//               <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
//                 {item.icon}
//               </div>
//               <div className={`
//                 transition-all duration-300 overflow-hidden
//                 ${isExpanded ? 'max-w-32 opacity-100' : 'max-w-0 opacity-0'}
//               `}>
//                 <h3 className={`
//                   whitespace-nowrap text-regular-14
//                   ${activeItem === item.id
//                     ? 'text-blue-600 dark:text-blue-400'
//                     : 'text-gray-700 dark:text-neutral-200'
//                   }
//                 `}>
//                   {item.label}
//                 </h3>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* فضای خالی */}
//       <div className="w-full h-10"></div>

//       {/* خط آبی کناری */}
//       {activeItem && (
//         <div className='absolute w-0 h-10 right-0 top-[88px] z-30'>
//           {NAVBAR_ICONS.BLUE_LINE}
//         </div>
//       )}

//       {/* Dropdown برای More */}
//       {isMoreDropdownOpen && (
//         <MoreDropdown onClose={handleCloseDropdown} />
//       )}
//     </nav>
//   );
// };

// export default Navbar;

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
    tooltipTimeoutRef.current = setTimeout(() => {
      setHoveredItem(itemId);
    }, 400);
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
                  transition-all duration-200 w-10 h-10
                  ${activeItem === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
                  }
                `}
                onClick={() => handleNavigation(item.id)}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  {item.icon}
                </div>
              </button>

              {/* Elegant Tooltip */}
              {hoveredItem === item.id && (
                <div className="absolute left-full ml-4 z-[70] pointer-events-none animate-tooltip">
                  <div className="tooltip-elegant px-4 py-2.5 rounded-xl">
                    <span className="text-white text-sm font-medium whitespace-nowrap tracking-wide">
                      {item.label}
                    </span>
                  </div>
                  {/* Elegant Arrow */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[1px] tooltip-arrow">
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 7L8 0V14L0 7Z" fill="url(#tooltipGradient)" />
                      <defs>
                        <linearGradient id="tooltipGradient" x1="0" y1="0" x2="8" y2="14" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#1f1f23" />
                          <stop offset="100%" stopColor="#2a2a32" />
                        </linearGradient>
                      </defs>
                    </svg>
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