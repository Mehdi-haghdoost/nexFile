"use client";
import React from 'react';
import { InfoIcon, ChevronDownIcon } from '@/components/ui/icons';

// The stored values stay the same; only how each one is described changed
const CONTROL_OPTIONS = [
    { value: 'folder-member', label: 'Owner, admins and editors' },
    { value: 'admins-only', label: 'Owner and admins' },
    { value: 'only-owner', label: 'Only the owner' },
];

// Control permissions for one file or folder; the access information switch stays hidden until viewer tracking exists
const DocSettingsContent = ({
    permissionLevel,
    setPermissionLevel,
    fileName,
    fileType = 'folder',
    disabled = false,
}) => {
    const isFolder = fileType === 'folder';

    return (
        <div className='flex flex-col items-start gap-6 self-stretch'>
            {/* Settings Info */}
            <div className='flex items-center py-2.5 px-3.5 gap-2 self-stretch rounded-lg border border-[#EBEFFE] bg-[#365AF9]/5 dark:border-neutral-600 dark:bg-neutral-800 dark:border-primary-border'>
                <div className='flex items-start pl-[26px] w-full gap-2 self-stretch relative'>
                    <p dir='auto' className='text-regular-14-neutral-500  dark:text-regular-14-neutral-200 flex-1 text-start'>
                        {isFolder
                            ? `Only you (the owner) can change these settings. They apply to '${fileName}' and everything inside it.`
                            : `Only you (the owner) can change these settings for '${fileName}'.`}
                    </p>
                    <div className='absolute left-0 top-[2px]'>
                        <InfoIcon />
                    </div>
                </div>
            </div>
            {/* Permissions Section */}
            <div className='flex flex-col items-start gap-4 self-stretch'>
                <div className='flex justify-between items-center gap-3 self-stretch'>
                    <div className='flex flex-1 flex-col items-start justify-center gap-0.5 '>
                        <label htmlFor='control-permissions' className='text-regular-14-neutral-500 dark:text-regular-14-neutral-300 self-stretch text-start'>
                            Control permissions
                        </label>
                        <p className='text-regular-12-neutral-200'>
                            Who can add people to this {isFolder ? 'folder' : 'file'}
                        </p>
                    </div>
                    <div className="relative">
                        <select
                            id='control-permissions'
                            value={permissionLevel}
                            disabled={disabled}
                            onChange={(e) => setPermissionLevel(e.target.value)}
                            className='appearance-none w-full h-8 items-center justify-center gap-2 rounded-lg border border-[#ECECEE] bg-white text-medium-14 dark:text-medium-14-white py-1 pr-8 pl-4 text-start shadow-light focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-800 dark:border-primary-border'
                        >
                            {CONTROL_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-neutral-400">
                            <ChevronDownIcon />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DocSettingsContent