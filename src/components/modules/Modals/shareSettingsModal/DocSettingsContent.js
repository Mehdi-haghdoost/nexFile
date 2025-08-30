"use client";
import React from 'react';
import { InfoIcon, VectorIcon, ChevronDownIcon } from '@/components/ui/icons';
import { Switch } from '@/components/ui/Switch';

const DocSettingsContent = ({
    isCommentsEnabled,
    setIsCommentsEnabled,
    permissionLevel,
    setPermissionLevel,
}) => {
    return (
        <div className='flex flex-col items-start gap-6 self-stretch'>
            {/* Settings Info */}
            <div className='flex items-center py-2.5 px-3.5 gap-2 self-stretch rounded-lg border border-[#EBEFFE] bg-[#365AF9]/5'>
                <div className='flex items-start pl-[26px] w-full gap-2 self-stretch relative'>
                    <p className='text-regular-14-neutral-500 flex-1 text-start'>Only you (the owner) can adjust these settings, which apply to all folders in 'Daily Task'</p>
                    <div className='absolute left-0 top-[2px]'>
                        <InfoIcon />
                    </div>
                </div>
            </div>
            {/* Permissions Section */}
            <div className='flex flex-col items-start gap-4 self-stretch'>
                <div className='flex justify-between items-center self-stretch'>
                    <div className='flex flex-1 flex-col items-start justify-center gap-0.5 '>
                        <p className='text-regular-14-neutral-500 self-stretch text-start'>Control permissions</p>
                        <p className='text-regular-12-neutral-200'>
                            Select who has permission to add users to this folder
                        </p>
                    </div>
                    <div className="relative">
                        <select
                            value={permissionLevel}
                            onChange={(e) => setPermissionLevel(e.target.value)}
                            className='appearance-none w-full h-8 items-center justify-center gap-2 rounded-lg border border-[#ECECEE] bg-white py-1 pr-8 pl-4 text-start text-medium-14 shadow-light focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            <option value="folder-member">Folder member</option>
                            <option value="only-owner">Only owner</option>
                            <option value="admins-only">Admins only</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDownIcon />
                        </div>
                    </div>
                </div>
                <VectorIcon />
                <div className='flex justify-center items-center self-stretch'>
                    <div className='flex flex-1 flex-col justify-center items-center gap-0.5'>
                        <p className='text-regular-14-neutral-500 self-stretch text-start'>Access Information</p>
                        <p className='text-regular-12-neutral-200 self-stretch text-start'>
                            Display who is viewing files in this folder
                            <br />
                            to users with edit access.
                        </p>
                    </div>
                    <div>
                        <Switch
                            initialValue={isCommentsEnabled}
                            onChange={setIsCommentsEnabled}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DocSettingsContent