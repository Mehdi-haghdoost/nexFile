import React from 'react'
import FilterDropdown from './FilterDropdown'

const FilterControls = () => {
  const filterOptions = [
    { label: 'From date:', value: 'All' },
    { label: 'Device:', value: 'All' },
    { label: 'In folder:', value: 'All' }
  ]

  return (
    <nav className='flex items-start gap-2' aria-label="Filter controls">
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