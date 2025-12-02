import React from 'react';

const FilterButton = ({ icon, label, isActive, onClick }) => {
  return (
    <button 
      className={`
        flex justify-center items-center 
        gap-1
        py-1.5 px-2.5 sm:py-1 sm:px-3
        rounded-md sm:rounded-lg
        text-[11px] sm:text-sm
        font-medium text-neutral-500 dark:text-white 
        whitespace-nowrap
        flex-shrink-0
        ${isActive 
          ? 'border border-stroke-200 dark:border-dark-border bg-white dark:bg-dark-gradient shadow-middle' 
          : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
        }
        transition-all duration-200
        active:scale-95
      `}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Filter by ${label}`}
    >
      <span className="flex-shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center">
        {icon}
      </span>
      <span className="flex-shrink-0">{label}</span>
    </button>
  );
};

export default FilterButton;