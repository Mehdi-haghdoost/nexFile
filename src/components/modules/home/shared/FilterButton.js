import React from 'react';

const FilterButton = ({ icon, label, isActive, onClick }) => {
  return (
    <button 
      className={`
        flex justify-center items-center gap-1 sm:gap-1.5 
        py-1 pr-2 pl-2 sm:pr-4 sm:pl-3 
        self-stretch rounded-lg
        ${isActive 
          ? 'border border-stroke-200 dark:border-dark-border bg-white dark:bg-dark-gradient shadow-middle' 
          : 'rounded-[5px]'
        }
        transition-all duration-200
        hover:bg-gray-50 dark:hover:bg-neutral-800
      `}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Filter by ${label}`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <h3 className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white whitespace-nowrap'>
        {label}
      </h3>
    </button>
  );
};

export default FilterButton;