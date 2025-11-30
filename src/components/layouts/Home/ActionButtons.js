"use client";
import ActionButtonsCard from '@/components/modules/home/ActionButtonsCard';
import { useEffect, useRef } from 'react';
import CreateDropdown from '@/components/modules/home/actionDropdowns/CreateDropdown';
import useModalStore from '@/store/ui/modalStore';
import useDropdownStore from '@/store/ui/dropdownStore';
import { actionButtonsConfig } from './actionButtonsConfig';

const ActionButtons = ({ activeSection = 'all-folders' }) => {
  const containerRef = useRef(null);
  const moreButtonRef = useRef(null);

  const { openModal } = useModalStore();
  const { 
    isMoreDropdownOpen, 
    toggleMoreDropdown,
    activeActionDropdown,
    setActiveActionDropdown,
    closeActiveActionDropdown 
  } = useDropdownStore();

  const actionButtons = actionButtonsConfig[activeSection] || actionButtonsConfig['all-folders'];

  const visibleButtonsCount = 2;
  const visibleButtons = actionButtons.slice(0, visibleButtonsCount);
  const hiddenButtons = actionButtons.slice(visibleButtonsCount);

  const handleMoreClick = () => {
    if (moreButtonRef.current) {
      const rect = moreButtonRef.current.getBoundingClientRect();
      const position = {
        top: rect.bottom + 8,
        left: rect.left,
      };
      toggleMoreDropdown(position);
    }
  };

  const handleActiveCart = (cardId) => {
    const clickedButton = actionButtons.find(button => button.id === cardId);

    if (clickedButton?.modal) {
      openModal(clickedButton.modal);
      closeActiveActionDropdown();
      return;
    }

    if (clickedButton?.dropdown) {
      if (activeActionDropdown === cardId) {
        closeActiveActionDropdown();
      } else {
        setActiveActionDropdown(cardId);
      }
      return;
    }

    closeActiveActionDropdown();
  }

  // کلیک خارج از dropdown برای بستن
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeActionDropdown === null) return;
      if (containerRef.current && containerRef.current.contains(e.target)) return;
      closeActiveActionDropdown();
    }

    if (activeActionDropdown !== null) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    }
  }, [activeActionDropdown, closeActiveActionDropdown]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && activeActionDropdown !== null) {
        closeActiveActionDropdown();
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [activeActionDropdown, closeActiveActionDropdown]);

  const getCardStyles = (cardId) => {
    if (activeActionDropdown === cardId) {
      return {
        bgColor: 'bg-primary-500/5',
        borderColor: 'border-primary-500 dark:border-primary-500',
        textColor: 'text-regular-14-primary-500 dark:text-regular-14-white',
        iconColor: 'dark:[&>svg>path]:stroke-white',
      }
    } else {
      return {
        bgColor: 'bg-white dark:bg-neutral-900',
        borderColor: 'border-[#E1E0E5] dark:border-neutral-600',
        textColor: 'text-regular-14-neutral-500 dark:text-regular-14-white',
        iconColor: '',
      }
    }
  }

  return (
    <div className='flex items-center gap-3 md:gap-4 w-full max-w-full' ref={containerRef}>
      
      {/* دکمه‌ها در دسکتاپ (≥ 1024px) */}
      <div className='hidden lg:flex items-center gap-4 flex-1 min-w-0'>
        {actionButtons.map((button, index) => {
          const cardStyles = getCardStyles(button.id);
          const DropdownComponent = CreateDropdown;
          const isLast = index === actionButtons.length - 1;
          
          return (
            <div className='relative flex-1 min-w-0' key={button.id}>
              <ActionButtonsCard
                title={button.title}
                icon={button.icon}
                onClick={() => handleActiveCart(button.id)}
                size="normal"
                {...cardStyles}
              />
              {activeActionDropdown === button.id && button.dropdown && (
                <DropdownComponent
                  onClose={closeActiveActionDropdown}
                  isLast={isLast}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* دکمه‌ها در تبلت و موبایل (< 1024px) */}
      <div className='flex lg:hidden items-center gap-2 sm:gap-3 w-full max-w-full'>
        {visibleButtons.map((button, index) => {
          const cardStyles = getCardStyles(button.id);
          const DropdownComponent = CreateDropdown;
          
          return (
            <div className='relative flex-1 min-w-0' key={button.id}>
              <ActionButtonsCard
                title={button.title}
                icon={button.icon}
                onClick={() => handleActiveCart(button.id)}
                size="compact"
                {...cardStyles}
              />
              {activeActionDropdown === button.id && button.dropdown && (
                <DropdownComponent
                  onClose={closeActiveActionDropdown}
                  isLast={false}
                />
              )}
            </div>
          )
        })}

        {/* دکمه More */}
        {hiddenButtons.length > 0 && (
          <div className='relative flex-1 min-w-0 max-w-[120px]'>
            <button
              ref={moreButtonRef}
              onClick={handleMoreClick}
              className={`
                flex flex-col p-2 sm:p-3 items-center justify-center gap-1
                w-full h-full min-h-[70px] sm:min-h-[80px]
                rounded-lg border
                ${isMoreDropdownOpen 
                  ? 'border-primary-500 bg-primary-500/5 dark:border-primary-500' 
                  : 'border-[#E1E0E5] bg-white dark:border-neutral-600 dark:bg-neutral-900'
                }
                cursor-pointer transition-all duration-200
                hover:scale-105 active:scale-95
              `}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                <path d="M10 10.8333C10.4602 10.8333 10.8333 10.4602 10.8333 10C10.8333 9.53976 10.4602 9.16667 10 9.16667C9.53976 9.16667 9.16667 9.53976 9.16667 10C9.16667 10.4602 9.53976 10.8333 10 10.8333Z" stroke="#2E2E37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-white"/>
                <path d="M10 5.00001C10.4602 5.00001 10.8333 4.62691 10.8333 4.16667C10.8333 3.70644 10.4602 3.33334 10 3.33334C9.53976 3.33334 9.16667 3.70644 9.16667 4.16667C9.16667 4.62691 9.53976 5.00001 10 5.00001Z" stroke="#2E2E37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-white"/>
                <path d="M10 16.6667C10.4602 16.6667 10.8333 16.2936 10.8333 15.8333C10.8333 15.3731 10.4602 15 10 15C9.53976 15 9.16667 15.3731 9.16667 15.8333C9.16667 16.2936 9.53976 16.6667 10 16.6667Z" stroke="#2E2E37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-white"/>
              </svg>
              <span className={`text-xs sm:text-sm font-medium ${isMoreDropdownOpen ? 'text-primary-500 dark:text-white' : 'text-neutral-500 dark:text-white'}`}>
                More
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActionButtons;