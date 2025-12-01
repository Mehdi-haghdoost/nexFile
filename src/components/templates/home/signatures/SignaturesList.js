import React, { useState } from 'react';
import { NewTaskIcon, NoFindingsIcon, SaveIcon } from '@/components/ui/icons';

const FilterButton = ({ icon, label, isActive, onClick }) => {
  const baseClasses = 'flex py-1 pr-3 sm:pr-4 pl-2 sm:pl-3 justify-center items-center gap-1 sm:gap-1.5 self-stretch text-xs sm:text-sm font-medium dark:text-white cursor-pointer transition-[border,box-shadow,transform,color,opacity]';
  const activeClasses = 'rounded-lg border border-stroke-200 bg-white shadow-middle dark:border-dark-border dark:bg-dark-gradient';
  const inactiveClasses = 'rounded bg-transparent dark:bg-transparent hover:bg-stroke-100 dark:hover:bg-neutral-700';

  return (
    <button 
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
};

const NoFindingsPlaceholder = () => (
  <div className="flex py-12 sm:py-[70px] px-4 sm:px-7 flex-col justify-center items-center gap-4 flex-1 self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
    <div className="flex w-16 h-16 sm:w-[72px] sm:h-[72px] flex-col justify-center items-center gap-2 rounded-2xl border-2 border-dark-white-70 bg-[linear-gradient(180deg,#E1E1E5_0%,#AFAFB2_100%)] dark:bg-dark-neutral-gradient">
      <NoFindingsIcon />
    </div>
    <div className="flex flex-col items-center gap-2 text-center px-4">
      <h3 className="text-sm sm:text-base font-medium text-neutral-500 dark:text-white">There were no findings</h3>
      <p className="text-xs text-neutral-300 dark:text-neutral-300 max-w-[245px]">
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
    <section className="flex flex-col flex-1 items-start gap-3 sm:gap-5 self-stretch w-full">
      <h3 className="text-base sm:text-lg font-medium text-neutral-500 dark:text-white">Signatures</h3>

      <div className="flex items-center justify-center gap-1 h-8 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100 dark:border-neutral-700 dark:bg-neutral-900 w-full sm:w-auto">
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