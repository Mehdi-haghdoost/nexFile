import React from 'react';

const FilterButton = ({ icon, label, isActive, onClick }) => {
  return (
    <button 
      className={isActive 
        ? 'flex justify-center items-center gap-1.5 py-1 pr-4 pl-3 self-stretch rounded-lg border border-stroke-200 dark:border-dark-border bg-white dark:bg-dark-gradient  shadow-middle'
        : 'flex justify-center items-center gap-1.5 py-1 pr-4 pl-3 self-stretch rounded-[5px]'
      }
      onClick={onClick}
    >
      {icon}
      <h3 className='text-medium-14 dark:text-medium-14-white'>{label}</h3>
    </button>
  );
};

export default FilterButton;