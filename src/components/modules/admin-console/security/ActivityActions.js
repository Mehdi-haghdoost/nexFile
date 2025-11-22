import React from 'react';
import { UploadIcon, WhiteTrashIcon } from '@/components/ui/icons';

const ActivityActions = () => {
    return (
        <div className="flex items-center gap-3">
            {/* Export Button */}
            <button className="btn-secondary dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel dark:text-medium-14-white">
                <UploadIcon className="transition-transform duration-200 group-hover:scale-110" />
                <span className="group-hover:text-information-500 transition-colors duration-200">
                    Export
                </span>
            </button>

            {/* Clear Button */}
            <button className="flex justify-center items-center gap-1.5 h-8 py-1 pr-4 pl-3 rounded-lg border border-error-400 bg-gradient-error shadow-light hover:shadow-middle transition-all duration-200 hover:brightness-110 active:scale-95 group">
                <WhiteTrashIcon className="transition-transform duration-200 group-hover:scale-110" />
                <span className="text-medium-14-white group-hover:text-white transition-colors duration-200">
                    Clear
                </span>
            </button>
        </div>
    );
};

export default ActivityActions;