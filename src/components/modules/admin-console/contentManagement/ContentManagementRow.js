import React from 'react';
import { FolderIcon } from '@/components/ui/icons';
import ContentManagementActionButton from './ContentManagementActionButton';

const ContentManagementRow = ({ member, isSelected, onSelect }) => {
    return (
        <li className='flex items-center gap-3 px-3 py-2 self-stretch border-b border-stroke-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-custom hover:-translate-y-0.5 cursor-pointer group'>
            <div className='flex flex-1 items-center gap-3 min-w-0'>
                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch min-w-0'>
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelect(member.id)}
                        className="h-[18px] w-[18px] rounded-[4px] border-[#EAEAEB] text-blue-600 focus:ring-blue-500 focus:ring-offset-0 dark:invert dark:hue-rotate-180 dark:brightness-75 dark:accent-white"
                        aria-label={`Select ${member.folder}`}
                    />
                    <FolderIcon className="flex-shrink-0" staticColor />
                    <h4 className='text-regular-14 truncate ml-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300'>{member.folder}</h4>
                </div>

                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch min-w-0'>
                    <img
                        className='w-6 h-6 rounded-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300'
                        src={member.avatar}
                        alt={`${member.name} avatar`}
                    />
                    <h4 className='text-regular-14 truncate group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300'>{member.name}</h4>
                </div>

                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch min-w-0'>
                    <p className='text-regular-14 whitespace-nowrap group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300'>{member.storageUsage}</p>
                </div>

                <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch flex-shrink-0'>
                    <p className='text-regular-14 whitespace-nowrap group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300'>{member.lastModified}</p>
                </div>

                <ContentManagementActionButton memberId={member.id} />
            </div>
        </li>
    );
};

export default ContentManagementRow;