import { DownloadIcon } from '@/components/ui/icons'
import useModalStore from '@/store/modalStore'
import React, { useState } from 'react'

const RequestForFiles = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  const { openModal } = useModalStore()

  const filterOptions = [
    { label: 'All', value: 'All' },
    { label: 'Opened', value: 'Opened' },
    { label: 'Closed', value: 'Closed' }
  ]

   const handleNewRequest = () => {
    openModal('fileRequest')
  }

  return (
    <main className='flex flex-1 flex-col items-start gap-5 self-stretch'>
      {/* File List Header */}
      <header className='flex justify-between items-center self-stretch'>
        <h1 className='text-medium-18'>Request for files</h1>
        <button 
          type="button"
          className='flex justify-center items-center gap-1.5 h-8 py-[13px] px-[14px] rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14'
          aria-label="Create new request"
          onClick={handleNewRequest}
        >
          New request
        </button>
      </header>

      {/* Filter Navigation */}
      <nav className='flex justify-center items-center gap-1 rounded-lg border border-stroke-300 bg-stroke-100 p-0.5 h-8 w-[350px]' role="tablist">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={activeFilter === option.value}
            className={`flex flex-1 justify-center items-center gap-1.5 py-1 px-[14px] self-stretch transition-all duration-300 ease-in-out ${
              activeFilter === option.value 
                ? 'rounded-lg border border-stroke-200 bg-white shadow-middle transform scale-[1.02]' 
                : 'hover:bg-white/50'
            }`}
            onClick={() => setActiveFilter(option.value)}
          >
            <span className={`text-medium-14 transition-colors duration-300 ${
              activeFilter === option.value ? 'text-gray-900' : 'text-gray-600'
            }`}>
              {option.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Empty State */}
      <section className='flex flex-1 flex-col justify-center items-center py-4 px-7 self-stretch rounded-lg border-stroke-200 bg-white' aria-labelledby="empty-state-title">
        <div className='flex flex-col justify-center items-center gap-2 p-1 w-[72px] h-[72px] rounded-2xl border-2 border-[rgba(255,255,255,0.70)] bg-gradient-to-b from-[#E1E1E5] to-[#AFAFB2]'>
          <div className='flex items-center justify-center'>
            <DownloadIcon aria-hidden="true" />
          </div>
        </div>
        
        <div className='flex flex-col items-center gap-2'>
          <h2 id="empty-state-title" className='text-medium-16'>There is currently no request file</h2>
          <p className='text-regular-12 text-center w-[500px]'>
            Request files from anyone, with or without a KeepCloud account, and store them securely in your chosen folder. Files are auto-organized, ensuring privacy.
          </p>
        </div>
      </section>
    </main>
  )
}

export default RequestForFiles