'use client';
import React from 'react';
import { format } from 'date-fns';
import { FolderIcon } from '@/components/ui/icons';
import ContentActionMenu from './ContentActionMenu';

const DEFAULT_AVATAR = '/images/nav_img.png';

const CHECKBOX_CLASSES =
    'h-[18px] w-[18px] rounded-[4px] border-[#EAEAEB] text-blue-600 focus:ring-blue-500 focus:ring-offset-0 dark:invert dark:hue-rotate-180 dark:brightness-75 dark:accent-white flex-shrink-0 cursor-pointer';

const ContentManagementRow = ({ member, isSelected, onSelect, onSetArchived }) => {
    // Format the raw timestamp coming from the API
    const lastModified = member.lastModified
        ? format(new Date(member.lastModified), 'dd/MM/yyyy')
        : '';

    return (
        <>
            {/* Desktop view */}
            <li className='hidden md:flex items-center gap-3 px-3 py-3 self-stretch border-b border-stroke-300 dark:border-neutral-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors group'>
                <div className='flex flex-1 items-center gap-3 min-w-0'>
                    <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch min-w-0'>
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onSelect(member.id)}
                            className={CHECKBOX_CLASSES}
                            aria-label={`Select ${member.folder}`}
                        />
                        <FolderIcon className="flex-shrink-0" staticColor />
                        <h4 className='text-sm text-neutral-300 dark:text-neutral-300 truncate group-hover:text-gray-900 dark:group-hover:text-white transition-colors'>{member.folder}</h4>
                        {member.isArchived && (
                            <span className='text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-300 flex-shrink-0'>
                                Archived
                            </span>
                        )}
                    </div>

                    <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch min-w-0 flex-shrink-0'>
                        <img
                            className='w-6 h-6 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform duration-300'
                            src={member.avatar || DEFAULT_AVATAR}
                            alt={`${member.name} avatar`}
                        />
                        <h4 className='text-sm text-neutral-300 dark:text-neutral-300 truncate group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors'>{member.name}</h4>
                    </div>

                    <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch min-w-0 flex-shrink-0'>
                        <p className='text-sm text-neutral-300 dark:text-neutral-300 whitespace-nowrap group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors'>{member.storageUsage}</p>
                    </div>

                    <div className='flex items-center gap-2 w-[140px] md:w-[180px] py-0 px-3 self-stretch flex-shrink-0'>
                        <p className='text-sm text-neutral-300 dark:text-neutral-300 whitespace-nowrap group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors'>{lastModified}</p>
                    </div>

                    <ContentActionMenu item={member} onSetArchived={onSetArchived} />
                </div>
            </li>

            {/* Mobile card view */}
            <li className='flex md:hidden flex-col gap-3 p-3 border-b border-stroke-300 dark:border-neutral-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors'>
                <div className='flex items-center justify-between gap-2 w-full'>
                    <div className='flex items-center gap-2 flex-1 min-w-0'>
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onSelect(member.id)}
                            className={CHECKBOX_CLASSES}
                            aria-label={`Select ${member.folder}`}
                        />
                        <FolderIcon className="flex-shrink-0" staticColor />
                        <h4 className='text-sm font-medium text-neutral-500 dark:text-white truncate'>{member.folder}</h4>
                    </div>
                    <ContentActionMenu item={member} onSetArchived={onSetArchived} />
                </div>

                <div className='flex flex-col gap-2 pl-8'>
                    <div className='flex items-center gap-2'>
                        <span className='text-xs text-neutral-200 dark:text-neutral-400'>Shared by:</span>
                        <div className='flex items-center gap-1.5'>
                            <img
                                className='w-4 h-4 rounded-full'
                                src={member.avatar || DEFAULT_AVATAR}
                                alt={`${member.name} avatar`}
                            />
                            <span className='text-xs text-neutral-400 dark:text-neutral-300'>{member.name}</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='text-xs text-neutral-200 dark:text-neutral-400'>Size:</span>
                        <span className='text-xs text-neutral-400 dark:text-neutral-300'>{member.storageUsage}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='text-xs text-neutral-200 dark:text-neutral-400'>Modified:</span>
                        <span className='text-xs text-neutral-400 dark:text-neutral-300'>{lastModified}</span>
                    </div>
                </div>
            </li>
        </>
    );
};

export default ContentManagementRow;