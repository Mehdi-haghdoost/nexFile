import { LicensesIcon, SearchIcon, SettingIcon, UsersPlusIcon } from '@/components/ui/icons';
import React from 'react';

const MembersContent = () => (
    <div className='flex flex-1 flex-col items-start gap-6 py-6 px-8 self-stretch bg-white'>
        {/* Manage licenses */}
        <div className='flex items-start gap-4 self-stretch'>
            {/* Manage licenses Icon */}
            <div className='flex flex-col items-start gap-2 p-3 w-[156.833px] rounded-lg border border-stroke-500 bg-white'>
                <LicensesIcon />
                <h3 className='text-regular-14-neutral-500'>Manage licenses</h3>
            </div>
            {/* Settings */}
            <div className='flex flex-col items-start gap-2 p-3 w-[156.833px] rounded-lg border border-stroke-500 bg-white'>
                <SettingIcon />
                <h3 className='text-regular-14-neutral-500'>Settings</h3>
            </div>
        </div>


        {/* Group Filter Container */}
        <div className='flex flex-1 flex-col items-start gap-5 self-stretch'>
            {/* Group Filter */}
            <div className='flex justify-between items-start self-stretch'>
                {/* Filter Button */}
                <div className='flex justify-center items-center gap-1 p-0.5 h-8 rounded-lg border border-stroke-300 bg-stroke-100'>
                    {/* Active Tab */}
                    <div className='flex justify-center items-center gap-1.5 py-1 px-[14px] rounded-lg border border border-stroke-200 bg-white shadow-middle'>
                        <h3 className='text-regular-14-neutral-500'>Active</h3>
                    </div>
                    {/* Suggested Tab */}
                    <div className='flex justify-center items-center gap-1.5 py-1 px-[14px] rounded-[5px]'>
                        <h3 className='text-regular-14-neutral-500'>Suggested</h3>
                    </div>
                    {/* Guests Tab */}
                    <div className='flex justify-center items-center gap-1.5 py-1 px-[14px] rounded-[5px]'>
                        <h3 className='text-regular-14-neutral-500'>Guests</h3>
                    </div>
                    {/* Invited Tab */}
                    <div className='flex justify-center items-center gap-1.5 py-1 px-[14px] rounded-[5px]'>
                        <h3 className='text-regular-14-neutral-500'>Invited</h3>
                    </div>
                    {/* Suspended Tab */}
                    <div className='flex justify-center items-center gap-1.5 py-1 px-[14px] rounded-[5px]'>
                        <h3 className='text-regular-14-neutral-500'>Suspended</h3>
                    </div>
                    {/* Removed Tab */}
                    <div className='flex justify-center items-center gap-1.5 py-1 px-[14px] rounded-[5px]'>
                        <h3 className='text-regular-14-neutral-500'>Removed</h3>
                    </div>
                </div>

                {/* Search and Button Container */}
                <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-1.5 h-8  py-[13px] pr-4 pl-3 rounded-lg border border-stroke-200 bg-white shadow-light'>
                        <SearchIcon />
                        <input
                            className='flex-1 text-regular-12-manrope outline-0'
                            type="text" name="" id="" />
                    </div>
                    <button
                        className='flex justify-center items-center gap-1.5 py-[13px] px-3 h-8 rounded-lg border border-[#5749BF] shadow-heavy bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] text-medium-14-white text-sm whitespace-nowrap hover:opacity-90 transition-opacity'
                    >
                        <UsersPlusIcon />
                        Invite members
                    </button>
                </div>
            </div>

            {/* Group List Container */}
            <div className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200'>
                {/* Group List Header */}
                <div className='flex items-center gap-2 h-[40px] py-[13px] px-4 self-stretch border-b border-stroke-300 bg-stroke-50'>
                    <div className='flex flex-1 items-center gap-3'>
                        {/* Group Name Header */}
                        <div className='flex flex-1 items-center gap-2 h-[22px] py-0 px-3'>
                            <h3 className='text-regular-14'>Name</h3>
                        </div>
                        {/* Role Header */}
                        <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                            <h3 className='text-regular-14'>Role</h3>
                        </div>
                        {/* Storage Usage Header */}
                        <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                            <h3 className='text-regular-14'>Storage usage</h3>
                        </div>
                        {/* Content Permissions Header */}
                        <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch'>
                            <h3 className='text-regular-14'>Content premissions</h3>
                        </div>
                        {/* Action Header */}
                        <div className='flex items-center justify-center self-stretch w-[52px] py-0 px-3'>
                            <h3 className='text-regular-14'>Action</h3>
                        </div>
                    </div>
                </div>
                {/* Group Item Container */}
                <div className='flex items-center gap-2 h-[52px] py-[13px] px-3 self-stretch'>
                    <div className='flex flex-1 items-center gap-2'>
                        {/* Group Name Container */}
                        <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch '>
                            <img
                                className='w-6 h-6 rounded-3xl'
                                src="/images/adrian.png" alt="adrian.png" />
                            <h3 className='text-medium-14'>Adrian Carter</h3>
                        </div>
                        {/* Role Container */}
                        <div className='flex flex-1 items-center gap-3 py-0 px-3 self-stretch'>
                            <h3 className='text-medium-14'>Admin</h3>
                        </div>
                        {/* Member Storage Usage */}
                        <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                            <h3 className='text-medium-14'>50 MB</h3>
                        </div>
                        {/* Content Permissions Container */}
                        <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch'>
                            <h3 className='text-medium-14'>Can Edit</h3>
                        </div>
                        {/* Action Container */}
                        <div className='flex justify-center items-center gap-2 w-[52px] py-0 px-3'>
                            <button
                                className='flex items-center justify-center w-8 h-8 p-1 gap-2.5 shadow-custom border border-[#F2F2F3] bg-white rounded cursor-pointer hover:bg-gray-50 transition-colors'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="12" viewBox="0 0 4 12" fill="none">
                                    <path d="M3.33337 1.33333C3.33337 0.6 2.73337 0 2.00004 0C1.26671 0 0.666708 0.6 0.666708 1.33333C0.666708 2.06667 1.26671 2.66667 2.00004 2.66667C2.73337 2.66667 3.33337 2.06667 3.33337 1.33333Z" fill="#2E2E37" />
                                    <path d="M3.33337 10.6666C3.33337 9.93325 2.73337 9.33325 2.00004 9.33325C1.26671 9.33325 0.666708 9.93325 0.666708 10.6666C0.666708 11.3999 1.26671 11.9999 2.00004 11.9999C2.73337 11.9999 3.33337 11.3999 3.33337 10.6666Z" fill="#2E2E37" />
                                    <path d="M3.33337 6.00008C3.33337 5.26675 2.73337 4.66675 2.00004 4.66675C1.26671 4.66675 0.666708 5.26675 0.666708 6.00008C0.666708 6.73341 1.26671 7.33341 2.00004 7.33341C2.73337 7.33341 3.33337 6.73341 3.33337 6.00008Z" fill="#2E2E37" />
                                </svg>
                            </button>
                        </div>

                    </div>
                </div>
                {/* Group Item Container */}
                <div className='flex items-center gap-2 h-[52px] py-[13px] px-3 self-stretch'>
                    <div className='flex flex-1 items-center gap-2'>
                        {/* Group Name Container */}
                        <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch '>
                            <img
                                className='w-6 h-6 rounded-3xl'
                                src="/images/adrian.png" alt="adrian.png" />
                            <h3 className='text-medium-14'>Adrian Carter</h3>
                        </div>
                        {/* Role Container */}
                        <div className='flex flex-1 items-center gap-3 py-0 px-3 self-stretch'>
                            <h3 className='text-medium-14'>Admin</h3>
                        </div>
                        {/* Member Storage Usage */}
                        <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                            <h3 className='text-medium-14'>50 MB</h3>
                        </div>
                        {/* Content Permissions Container */}
                        <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch'>
                            <h3 className='text-medium-14'>Can Edit</h3>
                        </div>
                        {/* Action Container */}
                        <div className='flex justify-center items-center gap-2 w-[52px] py-0 px-3'>
                            <button
                                className='flex items-center justify-center w-8 h-8 p-1 gap-2.5 shadow-custom border border-[#F2F2F3] bg-white rounded cursor-pointer hover:bg-gray-50 transition-colors'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="12" viewBox="0 0 4 12" fill="none">
                                    <path d="M3.33337 1.33333C3.33337 0.6 2.73337 0 2.00004 0C1.26671 0 0.666708 0.6 0.666708 1.33333C0.666708 2.06667 1.26671 2.66667 2.00004 2.66667C2.73337 2.66667 3.33337 2.06667 3.33337 1.33333Z" fill="#2E2E37" />
                                    <path d="M3.33337 10.6666C3.33337 9.93325 2.73337 9.33325 2.00004 9.33325C1.26671 9.33325 0.666708 9.93325 0.666708 10.6666C0.666708 11.3999 1.26671 11.9999 2.00004 11.9999C2.73337 11.9999 3.33337 11.3999 3.33337 10.6666Z" fill="#2E2E37" />
                                    <path d="M3.33337 6.00008C3.33337 5.26675 2.73337 4.66675 2.00004 4.66675C1.26671 4.66675 0.666708 5.26675 0.666708 6.00008C0.666708 6.73341 1.26671 7.33341 2.00004 7.33341C2.73337 7.33341 3.33337 6.73341 3.33337 6.00008Z" fill="#2E2E37" />
                                </svg>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default MembersContent;