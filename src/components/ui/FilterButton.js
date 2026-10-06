import React from 'react';

// One filter button for every list that has a filter row
const FilterButton = ({ icon, label, isActive, onClick, ariaLabel }) => {
    return (
        <button
            type='button'
            onClick={onClick}
            role='tab'
            aria-selected={isActive}
            aria-label={ariaLabel || `Filter by ${label}`}
            // Only the active tab takes focus, so arrow keys move between them rather than tab
            tabIndex={isActive ? 0 : -1}
            className={`
                flex shrink-0 items-center justify-center gap-1 sm:gap-1.5
                py-1 px-2.5 sm:py-1 sm:pr-4 sm:pl-3 self-stretch rounded-lg
                text-[11px] sm:text-sm font-medium text-neutral-500 dark:text-white whitespace-nowrap
                transition-all duration-200 active:scale-95
                ${isActive
                    ? 'border border-stroke-200 dark:border-dark-border bg-white dark:bg-dark-gradient shadow-middle'
                    : 'border border-transparent hover:bg-gray-50 dark:hover:bg-neutral-800'
                }
            `}
        >
            <span className='flex h-3.5 w-3.5 shrink-0 items-center justify-center sm:h-4 sm:w-4'>
                {icon}
            </span>
            <span className='shrink-0'>{label}</span>
        </button>
    );
};

export default FilterButton;