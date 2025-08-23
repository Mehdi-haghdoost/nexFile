import { FolderIcon, OverviewIcon } from '@/components/ui/icons'
import React from 'react'

const FolderItem = ({ folder, isSelected = false, onSelect, showDivider = true }) => {
    const handleClick = () => {
        if (onSelect && folder) {
            onSelect(folder);
        }
    };

    const itemClasses = `
        flex items-center py-[10px] px-3 h-[42px] gap-3 self-stretch rounded-lg 
        transition-all duration-200 ease-in-out cursor-pointer
        ${isSelected
            ? 'bg-blue-50 border border-blue-200'
            : 'hover:bg-[#F6F6F7]'
        }
    `.trim();

    return (
        <>
            <li className={itemClasses} onClick={handleClick}>
                <FolderIcon />
                <h3 className='text-medium-14 flex-1'>
                    {folder?.name || 'Unnamed Folder'}
                </h3>
                <OverviewIcon />
            </li>
            {showDivider && (
                <svg xmlns="http://www.w3.org/2000/svg" width="444" height="1" viewBox="0 0 444 1" fill="none">
                    <path d="M0 0.5H444" stroke="#F2F2F3" />
                </svg>
            )}
        </>
    )
}

export default FolderItem