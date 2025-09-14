import React from 'react';

const FilterButton = ({ icon, label, isActive, onClick, ariaLabel }) => {
  const baseClasses = 'flex py-1 pr-4 pl-3 justify-center items-center gap-1.5 self-stretch text-medium-14 transition-colors cursor-pointer';
  const activeClasses = 'rounded-lg border border-stroke-200 bg-white shadow-middle';
  const inactiveClasses = 'rounded hover:bg-white/50';

  return (
    <button
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
      aria-label={ariaLabel || `Filter by ${label}`}
      aria-pressed={isActive}
      type="button"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default FilterButton;