"use client";

import Link from 'next/link'
import { BellIcon, LaunchIcon, QuestionIcon } from '@/components/ui/icons'
import useAuthStore from '@/store/auth/authStore'
import { useTransferNotices } from '@/hooks/transfers/useTransferNotices'
import TransferAppSwitcher from './header/TransferAppSwitcher'
import TransferHeaderPopover from './header/TransferHeaderPopover'
import TransferNoticesPanel from './header/TransferNoticesPanel'
import TransferHelpPanel from './header/TransferHelpPanel'
import TransferUserMenu from './header/TransferUserMenu'

const TransferHeader = () => {
  const user = useAuthStore((state) => state.user)
  const { notices, isLoading, unreadCount, seenAt, markAllSeen } = useTransferNotices()

  return (
    <header className='flex justify-between items-center py-4 md:py-5 px-4 md:px-8 self-stretch border-b border-l border-solid border-stroke-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'>
      {/* Switch apps, or return to the rest of NexFile */}
      <nav className='flex items-center gap-2 md:gap-4' aria-label="Primary navigation">
        <TransferAppSwitcher />

        <Link
          href='/home'
          title='Back to NexFile'
          className='flex items-center gap-2 rounded-lg px-1 py-0.5 transition-opacity hover:opacity-70'
        >
          <figure className='flex justify-center items-center gap-2 w-6 h-6 p-1 aspect-[16/9] rounded-sm border border-[rgba(255,255,255,0.7)] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] m-0'>
            <LaunchIcon />
          </figure>
          <h1 className='text-sm md:text-medium-18 m-0 dark:text-medium-18-white font-medium'>Transfer</h1>
        </Link>
      </nav>

      {/* User Menu */}
      <div className='flex justify-center items-center gap-2 md:gap-3'>
        {/* Opening the panel marks everything in it read */}
        <TransferHeaderPopover
          label='Activity'
          badgeCount={unreadCount}
          onOpen={markAllSeen}
          icon={<BellIcon />}
        >
          <TransferNoticesPanel notices={notices} isLoading={isLoading} seenAt={seenAt} />
        </TransferHeaderPopover>

        <TransferHeaderPopover label='How transfers work' icon={<QuestionIcon />}>
          <TransferHelpPanel />
        </TransferHeaderPopover>

        <TransferUserMenu user={user} />
      </div>
    </header>
  )
}

export default TransferHeader