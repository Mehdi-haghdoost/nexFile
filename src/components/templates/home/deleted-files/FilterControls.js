import React from 'react'
import FilterDropdown from './FilterDropdown'

const FilterControls = () => {
  const filterOptions = [
    { label: 'From date:', value: 'All' },
    { label: 'Device:', value: 'All' },
    { label: 'In folder:', value: 'All' }
  ]

  return (
    <nav className='flex flex-wrap items-start gap-2 w-full lg:w-auto' aria-label="Filter controls">
      {filterOptions.map((option, index) => (
        <FilterDropdown 
          key={index}
          label={option.label}
          value={option.value}
        />
      ))}
    </nav>
  )
}

export default FilterControls