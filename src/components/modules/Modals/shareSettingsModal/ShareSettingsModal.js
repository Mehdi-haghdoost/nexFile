"use client";
import React, { useState } from 'react';
import useModalStore from '@/store/modalStore';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { AccessLinkIcon, ChevronDownIcon, CloseIcon, InfoIcon, NewTaskIcon, VectorIcon, ViewOnlyLinkIcon } from '@/components/ui/icons';
import { Switch } from '@/components/ui/Switch';

const ShareSettingsModal = () => {

    const [isCommentsEnabled, setIsCommentsEnabled] = useState(false);
    const [permissionLevel, setPermissionLevel] = useState('folder-member');

    const { modals, closeModal } = useModalStore();
    const { isOpen, data } = modals.shareSettings || {};

    const handleClose = () => {
        closeModal('shareSettings');
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width="520px">
            <div className="w-full">
                {/* Form Content */}
                <div className='flex flex-col items-start gap-6 self-stretch mb-9'>
                    {/* Form Header */}
                    <div className='flex items-center justify-between self-stretch'>
                        <h3 className='text-medium-18'>Settings for file “Daily Task”</h3>
                        <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded">
                            <CloseIcon />
                        </button>
                    </div>
                    {/* Link Options */}
                    <div className='flex flex-col items-start gap-6 self-stretch'>
                        {/*  Filter Button*/}
                        <div className='flex justify-center items-center gap-1 h-8 w-full p-0.5 rounded-lg  border border-[#ECECEE] bg-[#F6F6F7]'>
                            <div className='flex flex-1 items-center justify-center gap-1.5 py-1 px-[9px] self-stretch rounded-lg border border-[#F2F2F3] bg-white shadow-middle'>
                                <NewTaskIcon />
                                <h3 className='text-medium-14'>Doc settings</h3>
                            </div>
                            <div className='flex flex-1 items-center justify-center gap-2.5 py-1 px-[9px] self-stretch rounded-[5px]'>
                                <AccessLinkIcon />
                                <h3 className='text-regular-14-neutral-500'>Edit access link</h3>
                            </div>
                            <div className='flex flex-1 items-center justify-center gap-2.5 py-1 px-[9px] self-stretch rounded-[5px]'>
                                <ViewOnlyLinkIcon />
                                <h3 className='text-regular-14-neutral-500'>View-only link</h3>
                            </div>
                        </div>
                        {/* Settings Info */}
                        <div className='flex items-center py-2.5 px-3.5 gap-2 self-stretch rounded-lg border border-[#EBEFFE] bg-[#365AF9]/5'>
                            {/* Settings Description */}
                            <div className='flex items-start pl-[26px] w-[489px] gap-2 self-stretch relative'>
                                <p className='text-regular-14-neutral-500 flex-1 text-start'>Only you (the owner) can adjust these settings, which apply to all folders in 'Daily Task'</p>
                                <div className='absolute left-0 top-[2px]'>
                                    <InfoIcon />
                                </div>
                            </div>
                        </div>
                        {/* Permissions Section */}
                        <div className='flex flex-col items-start gap-4 self-stretch'>
                            {/* <div className='flex justify-between items-center self-stretch'>
                                <div className='flex flex-1 flex-col items-start justify-center gap-0.5 '>
                                    <p className='text-regular-14-neutral-500 self-stretch text-start'>Control permissions</p>
                                    <p className='text-regular-12-neutral-200'>
                                        Select who has permission to add users to this folder
                                    </p>
                                </div>
                                <button className='flex h-8 items-center justify-center gap-2 rounded-lg border border-[#ECECEE] bg-white py-[13px] pr-3 pl-4 text-center text-medium-14 shadow-light'>
                                    Folder member
                                    <ChevronDownIcon />
                                </button>
                            </div> */}
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
                </div>
                {/* Footer */}
                <div className='flex justify-end items-center gap-3 self-stretch'>
                    <button className='flex h-8 items-center justify-center gap-2 rounded-lg border border-[#ECECEE] bg-white py-[13px] px-6 text-center text-medium-14 shadow-light'>
                        Back
                    </button>
                    <button className="flex h-8 items-center justify-center gap-2 rounded-lg border border-[#5749BF] bg-gradient-primary py-[13px] px-6 text-center text-medium-14-white shadow-heavy">
                        Save
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default ShareSettingsModal;
