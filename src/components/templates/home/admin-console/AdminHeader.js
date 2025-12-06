import { BellIcon, HelpCircleIcon, HistoryIcon, MenuIcon } from '@/components/ui/icons';
import React from 'react';

const AdminHeader = ({ activeSection, onMobileMenuToggle }) => {
    return (
        <div className='flex justify-between items-center min-h-[64px] sm:h-[80px] py-3 sm:py-5 px-4 sm:px-6 lg:px-8 flex-shrink-0 self-stretch bg-white border-b border-l border-stroke-200 dark:bg-neutral-900 dark:border-neutral-700 w-full'>
            <div className='flex items-center gap-3 flex-1 min-w-0'>
                {/* Mobile Menu Button */}
                <button
                    onClick={onMobileMenuToggle}
                    className='lg:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient hover:bg-gray-50 dark:hover:bg-neutral-800 active:scale-95 transition-all flex-shrink-0'
                    aria-label="Toggle menu"
                >
                    <MenuIcon />
                </button>
                
                <h2 className='text-base sm:text-lg lg:text-xl font-semibold text-neutral-500 dark:text-white truncate'>{activeSection}</h2>
            </div>
            
            <HeaderActions />
        </div>
    );
};

// Header Actions Component
const HeaderActions = () => (
    <div className='flex justify-center items-center gap-2 sm:gap-3 flex-shrink-0'>
        <ActionButton icon={HistoryIcon} label="History" className="hidden sm:flex" />
        <NotificationButton />
        <ActionButton icon={HelpCircleIcon} label="Help" className="hidden sm:flex" />
        <UserProfile />
    </div>
);

// Action Button Component
const ActionButton = ({ icon: Icon, label, className = "" }) => (
    <button
        className={`flex justify-center items-center gap-1.5 w-8 h-8 bg-white rounded-lg border border-stroke-300 shadow-light dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel hover:bg-gray-50 dark:hover:bg-neutral-800 active:scale-95 transition-all ${className}`}
        aria-label={label}
    >
        <Icon />
    </button>
);

// Notification Button Component
const NotificationButton = () => (
    <div className='relative w-8 h-8 flex-shrink-0'>
        <button className='flex items-center justify-center w-full h-full bg-white rounded-lg border border-stroke-300 shadow-light dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel hover:bg-gray-50 dark:hover:bg-neutral-800 active:scale-95 transition-all' aria-label="Notifications">
            <BellIcon />
            <span
                className='absolute top-[7px] right-[10px] w-[5px] h-[5px] bg-[#BC1828] rounded-full'
                aria-label="New notifications"
            />
        </button>
    </div>
);

// User Profile Component
const UserProfile = () => (
    <div className='hidden md:flex items-center gap-2 sm:gap-3 flex-shrink-0'>
        <img
            src="images/nav_img.png"
            className='h-[32px] w-[32px] sm:h-[38px] sm:w-[38px] rounded-full bg-no-repeat bg-center bg-cover flex-shrink-0'
            alt="User avatar"
        />
        <div className='hidden lg:flex flex-col justify-center items-start min-w-0'>
            <h3 className='text-sm sm:text-base font-medium text-neutral-500 dark:text-white truncate'>Ridwan T.</h3>
            <p className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 truncate'>ridwant@gmail.com</p>
        </div>
    </div>
);

export default AdminHeader;