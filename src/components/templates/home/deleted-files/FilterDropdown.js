import { ChevronDownIcon } from '@/components/ui/icons'
import React from 'react'

const FilterDropdown = ({ label, value }) => {
  return (
    <button
      className='flex justify-between items-center w-[180px] h-8 py-1 px-3 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient shadow-middle'
      aria-haspopup="listbox"
      aria-expanded="false"
    >
      <div className='flex items-center gap-1'>
        <span className='text-regular-14 text-center dark:text-regular-14-neutral-300'>{label}</span>
        <span className='text-regular-14-neutral-500 dark:text-regular-14-white'>{value}</span>
      </div>
      <ChevronDownIcon aria-hidden="true" />
    </button>
  )
}

export default FilterDropdown