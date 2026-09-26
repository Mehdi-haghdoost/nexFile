"use client";

import { BellIcon, OverviewsIcon, LaunchIcon, QuestionIcon } from '@/components/ui/icons'
import useAuthStore from '@/store/auth/authStore'

// Falls back to initials when an account has no avatar
const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?'

const TransferHeader = () => {
  const user = useAuthStore((state) => state.user)

  return (
    <header className='flex justify-between items-center py-4 md:py-5 px-4 md:px-8 self-stretch border-b border-l border-solid border-stroke-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'>
      {/* Logo Section */}
      <nav className='flex items-center gap-2 md:gap-4' aria-label="Primary navigation">
        <OverviewsIcon />
        <div className='flex items-center gap-2'>
          <figure className='flex justify-center items-center gap-2 w-6 h-6 p-1 aspect-[16/9] rounded-sm border border-[rgba(255,255,255,0.7)] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] m-0'>
            <LaunchIcon />
          </figure>
          <h1 className='text-sm md:text-medium-18 m-0 dark:text-medium-18-white font-medium'>Transfer</h1>
        </div>
      </nav>

      {/* User Menu */}
      <div className='flex justify-center items-center gap-2 md:gap-3'>
        {/* Notification Button */}
        <div className='relative w-8 h-8'>
          <button className='btn-icon w-full h-full dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel' aria-label="Notifications">
            <BellIcon />
            <span
              className='absolute top-[8px] right-[10px] w-[5px] h-[5px] bg-[#BC1828] rounded-full'
              aria-label="New notifications"
            />
          </button>
        </div>

        {/* Help Button */}
        <button className='btn-icon w-8 h-8 dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel' aria-label="Help">
          <QuestionIcon />
        </button>

        {/* Signed-in user, or a placeholder until the session resolves */}
        {user ? (
          <>
            <button className='hidden md:flex items-center gap-3' aria-label="User menu">
              {user.image ? (
                <img
                  src={user.image}
                  className='rounded-full w-[38px] h-[38px] object-cover'
                  alt={`${user.name} profile`}
                />
              ) : (
                <span className='flex w-[38px] h-[38px] items-center justify-center rounded-full bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] text-sm font-medium text-white'>
                  {getInitials(user.name)}
                </span>
              )}
              <div className='flex flex-col justify-center items-start max-w-[160px]'>
                <p dir='auto' className='text-medium-16 m-0 dark:text-medium-16-white truncate w-full text-left'>
                  {user.name}
                </p>
                <p className='text-regular-12 text-gray-600 m-0 dark:text-regular-12-neutral-300 truncate w-full text-left'>
                  {user.email}
                </p>
              </div>
            </button>

            <button className='md:hidden' aria-label="User menu">
              {user.image ? (
                <img
                  src={user.image}
                  className='rounded-full w-[38px] h-[38px] object-cover'
                  alt={`${user.name} profile`}
                />
              ) : (
                <span className='flex w-[38px] h-[38px] items-center justify-center rounded-full bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] text-sm font-medium text-white'>
                  {getInitials(user.name)}
                </span>
              )}
            </button>
          </>
        ) : (
          <div className='w-[38px] h-[38px] rounded-full bg-stroke-200 dark:bg-neutral-700 animate-pulse' />
        )}
      </div>
    </header>
  )
}

export default TransferHeader