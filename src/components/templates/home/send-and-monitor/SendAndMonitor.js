import React, { useState } from 'react';
import { ViewerIcon, FileIcon } from '@/components/ui/icons';
import FilterButton from './FilterButton';
import FileTable from './FileTable';

const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'Viewer', icon: <ViewerIcon />, label: 'Viewer' },
    { id: 'Files', icon: <FileIcon />, label: 'Files' }
  ];

  return (
    <div 
      className="flex items-center justify-center gap-1 h-8 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100"
      role="tablist"
      aria-label="Content filter options"
    >
      {filters.map((filter) => (
        <FilterButton
          key={filter.id}
          icon={filter.icon}
          label={filter.label}
          isActive={activeFilter === filter.id}
          onClick={() => onFilterChange(filter.id)}
          ariaLabel={`Show ${filter.label.toLowerCase()} content`}
        />
      ))}
    </div>
  );
};

const SendAndMonitor = () => {
  const [activeFilter, setActiveFilter] = useState('Viewer');

  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
    console.log('Filter changed to:', filterType);
    // Add your filtering logic here
  };

  return (
    <section className="flex flex-col flex-1 items-start gap-5 self-stretch">
      <header>
        <h2 className="text-medium-18">Send and monitor</h2>
      </header>

      <FilterTabs 
        activeFilter={activeFilter} 
        onFilterChange={handleFilterChange} 
      />

      <FileTable filterType={activeFilter} />
    </section>
  );
};

export default SendAndMonitor;