import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@/components/ui/icons';
import { ACTIVITY_FILTERS } from '@/utils/constants/securityConstants';

const ActivityFilters = () => {
    const [openFilter, setOpenFilter] = useState(null);

    const handleFilterClick = (filterId) => {
        setOpenFilter(openFilter === filterId ? null : filterId);
    };

    return (
        <nav className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {ACTIVITY_FILTERS.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => handleFilterClick(filter.id)}
                    className={`flex justify-between items-center h-9 sm:h-8 py-1.5 sm:py-1 px-3 rounded-lg border border-stroke-300 bg-white shadow-light hover:shadow-middle transition-all duration-200 hover:border-stroke-400 active:scale-95 dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel w-full sm:w-auto ${filter.width}`}
                >
                    <div className="flex items-center gap-2 pr-2 min-w-0 flex-1">
                        {filter.value ? (
                            <>
                                <span className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 whitespace-nowrap">{filter.label}</span>
                                <span className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-white truncate">{filter.value}</span>
                            </>
                        ) : (
                            <span className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-white whitespace-nowrap">{filter.label}</span>
                        )}
                    </div>
                    <div className="flex-shrink-0">
                        {openFilter === filter.id ? (
                            <ChevronRightIcon />
                        ) : (
                            <ChevronDownIcon />
                        )}
                    </div>
                </button>
            ))}
        </nav>
    );
};

export default ActivityFilters;