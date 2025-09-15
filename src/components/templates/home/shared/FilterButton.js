import React from 'react';

const FilterButton = ({ icon, label, isActive, onClick }) => {
  return (
    <button 
      className={isActive 
        ? 'flex justify-center items-center gap-1.5 py-1 pr-4 pl-3 self-stretch rounded-lg border border-stroke-200 bg-white shadow-middle'
        : 'flex justify-center items-center gap-1.5 py-1 pr-4 pl-3 self-stretch rounded-[5px]'
      }
      onClick={onClick}
    >
      {icon}
      <h3 className='text-medium-14'>{label}</h3>
    </button>
  );
};

export default FilterButton;