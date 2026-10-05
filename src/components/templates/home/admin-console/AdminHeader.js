'use client';
import { BellIcon, HelpCircleIcon, HistoryIcon, MenuIcon } from '@/components/ui/icons';
import useAuthStore from '@/store/auth/authStore';
import HeaderPopover from '@/components/modules/header/HeaderPopover';
import HelpPanel from '@/components/modules/header/HelpPanel';
import AdminActivityPanel from './AdminActivityPanel';
import { useNotices } from '@/hooks/notices/useNotices';
import NoticesPanel from '@/components/modules/header/NoticesPanel';
import { ADMIN_HELP_TOPICS } from '@/utils/constants/helpTopics';
import React from 'react';

const AdminHeader = ({ activeSection, onMobileMenuToggle }) => {
    const { notices, isLoading, unreadCount, seenAt, markAllSeen } = useNotices();

    return (
        <div className='flex justify-between items-center min-h-[64px] sm:h-[80px] py-3 sm:py-5 px-4 sm:px-6 lg:px-8 flex-shrink-0 self-stretch bg-white border-b border-l border-stroke-200 dark:bg-neutral-900 dark:border-neutral-700 w-full'>
            <div className='flex items-center gap-3 flex-1 min-w-0'>
                {/* Mobile menu button */}
                <button
                    onClick={onMobileMenuToggle}
                    className='lg:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient hover:bg-gray-50 dark:hover:bg-neutral-800 active:scale-95 transition-all flex-shrink-0'
                    aria-label="Toggle menu"
                >
                    <MenuIcon />
                </button>

                <h2 className='text-base sm:text-lg lg:text-xl font-semibold text-neutral-500 dark:text-white truncate'>{activeSection}</h2>
            </div>

            <div className='flex justify-center items-center gap-2 sm:gap-3 flex-shrink-0'>
                {/* The organization's own log, rather than the account feed below */}
                <div className='hidden sm:block'>
                    <HeaderPopover label='Recent activity' icon={<HistoryIcon />} width={360}>
                        <AdminActivityPanel />
                    </HeaderPopover>
                </div>

                <HeaderPopover
                    label='Activity'
                    badgeCount={unreadCount}
                    onOpen={markAllSeen}
                    icon={<BellIcon />}
                >
                    <NoticesPanel notices={notices} isLoading={isLoading} seenAt={seenAt} />
                </HeaderPopover>

                <div className='hidden sm:block'>
                    <HeaderPopover label='How the admin console works' icon={<HelpCircleIcon />}>
                        <HelpPanel title='How the admin console works' topics={ADMIN_HELP_TOPICS} />
                    </HeaderPopover>
                </div>

                <UserProfile />
            </div>
        </div>
    );
};

// User profile: reads the currently logged-in user from the auth store
const UserProfile = () => {
    const user = useAuthStore((s) => s.user);

    const displayName = user?.name || 'Loading...';
    const displayEmail = user?.email || '';

    return (
        <div className='hidden md:flex items-center gap-2 sm:gap-3 flex-shrink-0'>
            {user?.image ? (
                <img
                    src={user.image}
                    className='h-[32px] w-[32px] sm:h-[38px] sm:w-[38px] rounded-full object-cover flex-shrink-0'
                    alt={`${displayName} avatar`}
                />
            ) : (
                <span className='flex h-[32px] w-[32px] sm:h-[38px] sm:w-[38px] shrink-0 items-center justify-center rounded-full bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] text-sm font-medium text-white'>
                    {displayName.charAt(0).toUpperCase()}
                </span>
            )}
            <div className='hidden lg:flex flex-col justify-center items-start min-w-0'>
                <h3 className='text-sm sm:text-base font-medium text-neutral-500 dark:text-white truncate'>{displayName}</h3>
                <p className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 truncate'>{displayEmail}</p>
            </div>
        </div>
    );
};

export default AdminHeader;