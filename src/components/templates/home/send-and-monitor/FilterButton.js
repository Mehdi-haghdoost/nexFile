import React from 'react';

const FilterButton = ({ icon, label, isActive, onClick, ariaLabel }) => {
  const baseClasses = 'flex py-1 pr-4 pl-3 justify-center items-center gap-1.5 self-stretch text-medium-14 dark:text-medium-14-white cursor-pointer';
  const activeClasses = 'rounded-lg border border-stroke-200 bg-white shadow-middle dark:border-dark-border dark:bg-dark-gradient';
  const inactiveClasses = 'rounded bg-transparent dark:bg-transparent hover:bg-stroke-100 dark:hover:bg-neutral-700';

  return (
    <button
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      aria-label={ariaLabel || `Filter by ${label}`}
      tabIndex={isActive ? 0 : -1}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default FilterButton;