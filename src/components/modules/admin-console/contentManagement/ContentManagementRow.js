import React from 'react';
import { FolderIcon } from '@/components/ui/icons';
import ContentManagementActionButton from './ContentManagementActionButton';

const ContentManagementRow = ({ member, isSelected, onSelect }) => {
    return (
        <li className='flex items-center gap-2 h-[52px] py-[13px] px-3 self-stretch border-b border-stroke-100 last:border-b-0'>
            <div className='flex flex-1 items-center gap-2 min-w-0'>
                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch min-w-0'>
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelect(member.id)}
                        className='w-4 h-4 cursor-pointer flex-shrink-0'
                        aria-label={`Select ${member.folder}`}
                    />
                    <FolderIcon className="flex-shrink-0" />
                    <h4 className='text-medium-14 truncate'>{member.folder}</h4>
                </div>

                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch min-w-0'>
                    <img
                        className='w-6 h-6 rounded-3xl flex-shrink-0'
                        src={member.avatar}
                        alt={`${member.name} avatar`}
                    />
                    <h4 className='text-medium-14 truncate'>{member.name}</h4>
                </div>

                <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch min-w-0'>
                    <p className='text-medium-14 whitespace-nowrap'>{member.storageUsage}</p>
                </div>

                <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch flex-shrink-0'>
                    <p className='text-medium-14 whitespace-nowrap'>{member.lastModified}</p>
                </div>

                <ContentManagementActionButton memberId={member.id} />
            </div>
        </li>
    );
};

export default ContentManagementRow;