import { BellIcon, OverviewsIcon, LaunchIcon } from '@/components/ui/icons'

const TransferHeader = () => {
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6.06016 6.49967C6.2169 6.05412 6.52626 5.67841 6.93347 5.4391C7.34067 5.19978 7.81943 5.1123 8.28495 5.19215C8.75047 5.272 9.17271 5.51402 9.47688 5.87536C9.78106 6.2367 9.94753 6.69402 9.94683 7.16634C9.94683 8.49967 7.94683 9.16634 7.94683 9.16634M8.00016 11.833H8.00683M14.6668 8.49967C14.6668 12.1816 11.6821 15.1663 8.00016 15.1663C4.31826 15.1663 1.3335 12.1816 1.3335 8.49967C1.3335 4.81778 4.31826 1.83301 8.00016 1.83301C11.6821 1.83301 14.6668 4.81778 14.6668 8.49967Z"
              stroke="#2E2E37"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className='dark:stroke-white'
            />
          </svg>
        </button>

        {/* User Profile - Hidden on Mobile */}
        <button className='hidden md:flex items-center gap-3' aria-label="User menu">
          <img
            src="/images/nav_img.png"
            className='rounded-full w-[38px] h-[38px]'
            alt="Ridwan T. profile"
          />
          <div className='flex flex-col justify-center items-start w-[122px]'>
            <p className='text-medium-16 m-0 dark:text-medium-16-white'>Ridwan T.</p>
            <p className='text-regular-12 text-gray-600 m-0 dark:text-regular-12-neutral-300'>ridwant@gmail.com</p>
          </div>
        </button>

        {/* User Avatar Only - Mobile */}
        <button className='md:hidden' aria-label="User menu">
          <img
            src="/images/nav_img.png"
            className='rounded-full w-[38px] h-[38px]'
            alt="Ridwan T. profile"
          />
        </button>
      </div>
    </header>
  )
}

export default TransferHeader