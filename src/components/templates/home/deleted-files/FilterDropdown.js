import { ChevronDownIcon } from '@/components/ui/icons'
import React from 'react'

const FilterDropdown = ({ label, value }) => {
  return (
    <button
      className='flex justify-between items-center w-full sm:w-[160px] md:w-[180px] h-9 sm:h-8 py-1.5 sm:py-1 px-3 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient shadow-middle hover:bg-gray-50 dark:hover:bg-neutral-800 active:scale-95 transition-all'
      aria-haspopup="listbox"
      aria-expanded="false"
    >
      <div className='flex items-center gap-1 flex-1 min-w-0'>
        <span className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 whitespace-nowrap'>{label}</span>
        <span className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white truncate'>{value}</span>
      </div>
      <ChevronDownIcon aria-hidden="true" className="flex-shrink-0" />
    </button>
  )
}

export default FilterDropdown