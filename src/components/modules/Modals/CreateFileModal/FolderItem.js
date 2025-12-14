import { ChevronDownIcon, FolderIcon, OverviewIcon } from '@/components/ui/icons'
import React from 'react'

const FolderItem = ({ folder, isSelected = false, onSelect, showDivider = true, isExpanded = false }) => {
    const handleClick = () => {
        if (onSelect && folder) {
            onSelect(folder);
        }
    };

    const itemClasses = `
        flex items-center my-1.5 sm:my-2 px-2 sm:px-3 h-[38px] sm:h-[42px] gap-2 sm:gap-3 self-stretch rounded-lg 
        transition-all duration-200 ease-in-out cursor-pointer
        ${isSelected
            ? 'bg-blue-50 dark:bg-dark-overlay border border-blue-200 dark:border-neutral-600'
            : 'hover:bg-[#F6F6F7] dark:hover:bg-dark-overlay'
        }
    `.trim();

    return (
        <>
            <li className={itemClasses} onClick={handleClick}>
                <FolderIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <h3 className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white flex-1 truncate'>
                    {folder?.name || 'Unnamed Folder'}
                </h3>
                {isExpanded ? (
                    <ChevronDownIcon className="w-4 h-4 shrink-0" />
                ) : (
                    <OverviewIcon className="w-4 h-4 shrink-0" />
                )}
            </li>
            {showDivider && (
                <div className="w-full h-px bg-[#F2F2F3] dark:bg-neutral-700" />
            )}
        </>
    )
}

export default FolderItem