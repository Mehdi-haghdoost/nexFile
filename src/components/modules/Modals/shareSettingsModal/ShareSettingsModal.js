"use client";
import React, { useState } from 'react';
import useModalStore from '@/store/modalStore';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { AccessLinkIcon, CloseIcon, NewTaskIcon, ViewOnlyLinkIcon } from '@/components/ui/icons';
import DocSettingsContent from './DocSettingsContent';
import EditAccessLinkContent from './EditAccessLinkContent';
import ViewOnlyLinkContent from './ViewOnlyLinkContent';

const ShareSettingsModal = () => {
    const [activeTab, setActiveTab] = useState('docSettings');
    const [isCommentsEnabled, setIsCommentsEnabled] = useState(false);
    const [permissionLevel, setPermissionLevel] = useState('folder-member');

    const { modals, closeModal } = useModalStore();
    const { isOpen, data } = modals.shareSettings || {};

    const handleClose = () => {
        closeModal('shareSettings');
        setActiveTab('docSettings');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'docSettings':
                return <DocSettingsContent
                    isCommentsEnabled={isCommentsEnabled}
                    setIsCommentsEnabled={setIsCommentsEnabled}
                    permissionLevel={permissionLevel}
                    setPermissionLevel={setPermissionLevel}
                />;
            case 'editAccess':
                return <EditAccessLinkContent />;
            case 'viewOnly':
                return <ViewOnlyLinkContent />;
            default:
                return <DocSettingsContent
                    isCommentsEnabled={isCommentsEnabled}
                    setIsCommentsEnabled={setIsCommentsEnabled}
                    permissionLevel={permissionLevel}
                    setPermissionLevel={setPermissionLevel}
                />;
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width="520px">
            <div className="w-full flex flex-col max-h-[85vh]">
                {/* بخش بالایی: هدر و تب‌ها */}
                <div className="flex-shrink-0">
                    <div className='flex flex-col items-start gap-6 self-stretch'>
                        <div className='flex items-center justify-between self-stretch'>
                            <h3 className='text-medium-18'>Settings for file “Daily Task”</h3>
                            <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded">
                                <CloseIcon />
                            </button>
                        </div>
                        <div className='flex justify-center items-center gap-1 h-8 w-full p-0.5 rounded-lg border border-[#ECECEE] bg-[#F6F6F7]'>
                            <button
                                onClick={() => setActiveTab('docSettings')}
                                className={`flex flex-1 items-center justify-center gap-1.5 py-1 px-[9px] self-stretch rounded-lg transition-all ${activeTab === 'docSettings' ? 'border border-[#F2F2F3] bg-white shadow-middle' : ''}`}
                            >
                                <NewTaskIcon />
                                <h3 className={activeTab === 'docSettings' ? 'text-medium-14' : 'text-regular-14-neutral-500'}>Doc settings</h3>
                            </button>
                            <button
                                onClick={() => setActiveTab('editAccess')}
                                className={`flex flex-1 items-center justify-center gap-2.5 py-1 px-[9px] self-stretch rounded-[5px] transition-all ${activeTab === 'editAccess' ? 'border border-[#F2F2F3] bg-white shadow-middle' : ''}`}
                            >
                                <AccessLinkIcon />
                                <h3 className={activeTab === 'editAccess' ? 'text-medium-14' : 'text-regular-14-neutral-500'}>Edit access link</h3>
                            </button>
                            <button
                                onClick={() => setActiveTab('viewOnly')}
                                className={`flex flex-1 items-center justify-center gap-2.5 py-1 px-[9px] self-stretch rounded-[5px] transition-all ${activeTab === 'viewOnly' ? 'border border-[#F2F2F3] bg-white shadow-middle' : ''}`}
                            >
                                <ViewOnlyLinkIcon />
                                <h3 className={activeTab === 'viewOnly' ? 'text-medium-14' : 'text-regular-14-neutral-500'}>View-only link</h3>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pt-6 pr-2 -mr-4 min-h-0">
                    {renderContent()}
                </div>

                {/* بخش پایینی: فوتر */}
                <div className="flex-shrink-0 pt-6">
                    <div className='flex justify-end items-center gap-3 self-stretch'>
                        <button className='flex h-8 items-center justify-center gap-2 rounded-lg border border-[#ECECEE] bg-white py-[13px] px-6 text-center text-medium-14 shadow-light'>
                            Back
                        </button>
                        <button className="flex h-8 items-center justify-center gap-2 rounded-lg border border-[#5749BF] bg-gradient-primary py-[13px] px-6 text-center text-medium-14-white shadow-heavy">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default ShareSettingsModal;
