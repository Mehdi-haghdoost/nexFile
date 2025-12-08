import React from 'react';
import { UploadIcon, WhiteTrashIcon } from '@/components/ui/icons';

const ActivityActions = () => {
    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Export Button */}
            <button className="flex justify-center items-center gap-1.5 h-9 sm:h-8 py-1.5 sm:py-1 pr-3 sm:pr-4 pl-3 rounded-lg border border-stroke-300 bg-white shadow-light hover:shadow-middle transition-all duration-200 hover:border-stroke-400 active:scale-95 group dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel w-full sm:w-auto">
                <UploadIcon className="transition-transform duration-200 group-hover:scale-110 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-white group-hover:text-information-500 transition-colors duration-200">
                    Export
                </span>
            </button>

            {/* Clear Button */}
            <button className="flex justify-center items-center gap-1.5 h-9 sm:h-8 py-1.5 sm:py-1 pr-3 sm:pr-4 pl-3 rounded-lg border border-error-400 bg-gradient-error shadow-light hover:shadow-middle transition-all duration-200 hover:brightness-110 active:scale-95 group w-full sm:w-auto">
                <WhiteTrashIcon className="transition-transform duration-200 group-hover:scale-110 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-white group-hover:text-white transition-colors duration-200">
                    Clear
                </span>
            </button>
        </div>
    );
};

export default ActivityActions;