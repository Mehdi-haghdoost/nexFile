import React, { useState } from 'react';
import { NewTaskIcon, NoFindingsIcon, SaveIcon } from '@/components/ui/icons';

const FilterButton = ({ icon, label, isActive, onClick }) => {
  const baseClasses = 'flex py-1 pr-4 pl-3 justify-center items-center gap-1.5 self-stretch text-medium-14 transition-colors cursor-pointer';
  const activeClasses = 'rounded-lg border border-stroke-200 bg-white shadow-middle';
  const inactiveClasses = 'rounded hover:bg-white/50';
  
  return (
    <button 
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
};

const NoFindingsPlaceholder = () => (
  <div className="flex py-[70px] px-7 flex-col justify-center items-center gap-4 flex-1 self-stretch rounded-lg border border-stroke-200 bg-white">
    <div className="flex w-[72px] h-[72px] flex-col justify-center items-center gap-2 rounded-2xl border-2 border-white/70 bg-[linear-gradient(180deg,#E1E1E5_0%,#AFAFB2_100%)]">
      <NoFindingsIcon />
    </div>
    <div className="flex flex-col items-center gap-2">
      <h3 className="text-medium-16">There were no findings</h3>
      <p className="text-regular-12-light w-[245px] text-center">
        If you sign a document or send it for others to sign, it will appear in this section
      </p>
    </div>
  </div>
);

const SignaturesList = () => {
  const [activeFilter, setActiveFilter] = useState('document');

  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
    console.log('Filter changed to:', filterType);
    // Add your filtering logic here
  };

  return (
    <section className="flex flex-col flex-1 items-start gap-5 self-stretch">
      <h3 className="text-medium-18">Signatures</h3>
      
      <div className="flex items-center justify-center gap-1 h-8 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100">
        <FilterButton 
          icon={<NewTaskIcon />} 
          label="Document" 
          isActive={activeFilter === 'document'}
          onClick={() => handleFilterChange('document')}
        />
        <FilterButton 
          icon={<SaveIcon />} 
          label="Template" 
          isActive={activeFilter === 'template'}
          onClick={() => handleFilterChange('template')}
        />
      </div>
      
      <NoFindingsPlaceholder />
    </section>
  );
};

export default SignaturesList;