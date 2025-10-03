'use client'

import { useState } from 'react'
import { BellIcon, LaunchIcon, OverviewsIcon, SearchIcon } from '@/components/ui/icons'
import TransferEmptyState from '@/components/templates/transfer/TransferEmptyState'

const TransferPage = () => {
  const [activeTab, setActiveTab] = useState('all')

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'expired', label: 'Expired' }
  ]

  return (
    <div className='flex justify-center items-center bg-white'>
      <div className='flex flex-col items-start flex-shrink-0 border-t border-r border-l border-solid border-stroke-200 w-full'>
        
        {/* Header */}
        <header className='flex justify-between items-center py-5 px-8 self-stretch border-b border-l border-solid border-stroke-200 bg-white'>
          {/* Logo Section */}
          <nav className='flex items-center gap-4' aria-label="Primary navigation">
            <OverviewsIcon />
            <div className='flex items-center gap-2'>
              <figure className='flex justify-center items-center gap-2 w-6 h-6 p-1 aspect-[16/9] rounded-sm border border-[rgba(255,255,255,0.7)] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] m-0'>
                <LaunchIcon />
              </figure>
              <h1 className='text-medium-18 m-0'>Transfer</h1>
            </div>
          </nav>

          {/* User Menu */}
          <div className='flex justify-center items-center gap-3'>
            {/* Notification Button */}
            <div className='relative w-8 h-8'>
              <button className='btn-icon w-full h-full' aria-label="Notifications">
                <BellIcon />
                <span 
                  className='absolute top-0 right-0 w-[5px] h-[5px] bg-[#BC1828] rounded-full' 
                  aria-label="New notifications"
                />
              </button>
            </div>

            {/* Help Button */}
            <button className='btn-icon w-8 h-8' aria-label="Help">
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
                />
              </svg>
            </button>

            {/* User Profile */}
            <button className='flex items-center gap-3' aria-label="User menu">
              <img
                src="/images/nav_img.png"
                className='rounded-full w-[38px] h-[38px]'
                alt="Ridwan T. profile"
              />
              <div className='flex flex-col justify-center items-start w-[122px]'>
                <p className='text-medium-16 m-0'>Ridwan T.</p>
                <p className='text-regular-12 text-gray-600 m-0'>ridwant@gmail.com</p>
              </div>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className='flex-1 w-full'>
          <section 
            aria-label="Transfer content" 
            className='flex flex-1 flex-col items-start gap-6 py-6 px-8 self-stretch border-t border-l border-stroke-200 bg-white'
          >
            {/* File Section */}
            <div className='flex flex-1 flex-col items-start gap-5 self-stretch'>
              
              {/* Filter and Actions Container */}
              <div className='flex justify-between items-center self-stretch'>
                {/* Filter Tabs */}
                <div className='flex justify-center items-center gap-0.5 h-8 rounded-lg bg-white border border-stroke-300'>
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex justify-center items-center py-1 px-3.5 gap-1.5 rounded-lg
                        transition-all duration-300 ease-in-out
                        ${activeTab === tab.id
                          ? 'border border-stroke-200 bg-white shadow-light text-medium-14 scale-100'
                          : 'border border-transparent bg-transparent text-regular-14-neutral-500 hover:bg-gray-50 scale-95'
                        }
                      `}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className='flex items-start gap-3'>
                  {/* Search Input */}
                  <div className='flex items-center gap-1.5 h-8 w-[180px] py-[13px] pr-4 pl-3 rounded-lg bg-white shadow-light border border-stroke-200 transition-all duration-200 focus-within:border-[#5749BF]'>
                    <div className='scale-125 transition-transform duration-200'>
                      <SearchIcon />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search..."
                      className='flex-1 text-regular-12-manrope outline-none bg-transparent' 
                    />
                  </div>

                  {/* Custom Design Button */}
                  <button className='flex justify-center items-center gap-1.5 h-8 py-[13px] px-3.5 rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 transition-all duration-200 hover:border-gray-400 hover:shadow-md active:scale-95'>
                    Custom design
                  </button>

                  {/* Create Transfer Button */}
                  <button className='flex justify-center items-center gap-1.5 h-8 py-[13px] px-3.5 rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] shadow-light text-medium-14-white transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95'>
                    Create transfer
                  </button>
                </div>
              </div>

              {/* Sent/Received Tab Container */}
              <div className='flex items-start gap-3 border-b border-stroke-300'>
                {/* این قسمت برای تب‌های Sent و Received است */}
              </div>

              {/* Empty State */}
              <TransferEmptyState />
              
            </div>
          </section>
        </main>

      </div>
    </div>
  )
}

export default TransferPage