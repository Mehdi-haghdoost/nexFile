import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@/components/ui/icons';
import { ACTIVITY_FILTERS } from '@/utils/constants/securityConstants';

const ActivityFilters = () => {
    const [openFilter, setOpenFilter] = useState(null);

    const handleFilterClick = (filterId) => {
        setOpenFilter(openFilter === filterId ? null : filterId);
    };

    return (
        <nav className="flex items-center gap-3">
            {ACTIVITY_FILTERS.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => handleFilterClick(filter.id)}
                    className={`flex justify-between items-center h-8 py-1 px-3 rounded-lg border border-stroke-300 bg-white shadow-light hover:shadow-middle transition-all duration-200 hover:border-stroke-400 ${filter.width}`}
                >
                    <div className="flex items-center gap-2 pr-2">
                        {filter.value ? (
                            <>
                                <span className="text-regular-14">{filter.label}</span>
                                <span className="text-medium-14">{filter.value}</span>
                            </>
                        ) : (
                            <span className="text-medium-14">{filter.label}</span>
                        )}
                    </div>
                    {openFilter === filter.id ? (
                        <ChevronRightIcon />
                    ) : (
                        <ChevronDownIcon />
                    )}
                </button>
            ))}
        </nav>
    );
};

export default ActivityFilters;