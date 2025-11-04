"use client";
import React, { useState } from 'react';
import useModalStore from '@/store/ui/modalStore';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { AccessLinkIcon, CloseIcon, NewTaskIcon, ViewOnlyLinkIcon } from '@/components/ui/icons';
import DocSettingsContent from './DocSettingsContent';
import EditAccessLinkContent from './EditAccessLinkContent';
import ViewOnlyLinkContent from './ViewOnlyLinkContent';

const ShareSettingsModal = () => {
    const [activeTab, setActiveTab] = useState('docSettings');
    const [isCommentsEnabled, setIsCommentsEnabled] = useState(false);
    const [permissionLevel, setPermissionLevel] = useState('folder-member');
    
    // State برای کنترل وجود لینک
    const [hasSharedLink, setHasSharedLink] = useState(false);

    const { modals, closeModal } = useModalStore();
    const { isOpen, data } = modals.shareSettings || {};

    const handleClose = () => {
        closeModal('shareSettings');
        setActiveTab('docSettings');
    };

    // وقتی لینک ساخته میشه
    const handleLinkCreated = () => {
        setHasSharedLink(true);
        setActiveTab('viewOnly'); // خودکار به تب ViewOnly برو
    };

    // وقتی لینک حذف میشه
    const handleLinkDeleted = () => {
        setHasSharedLink(false);
        setActiveTab('editAccess');
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
                return <EditAccessLinkContent 
                    onLinkCreated={handleLinkCreated}
                />;
            case 'viewOnly':
                return <ViewOnlyLinkContent 
                    onLinkDeleted={handleLinkDeleted}
                />;
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
                            <h3 className='text-medium-18 dark:text-medium-18-white'>Settings for file "Daily Task"</h3>
                            <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded">
                                <CloseIcon />
                            </button>
                        </div>
                        <div className='flex justify-center items-center gap-1 h-8 w-full p-0.5 rounded-lg border border-[#ECECEE] bg-[#F6F6F7] dark:border-primary-500 dark:bg-neutral-900'>
                            {/* تب Doc Settings - همیشه فعال */}
                            <button
                                onClick={() => setActiveTab('docSettings')}
                                className={`flex flex-1 items-center justify-center gap-1.5 py-1 px-[9px] self-stretch rounded-lg transition-all ${
                                    activeTab === 'docSettings' ? 'border border-[#F2F2F3] bg-white shadow-middle dark:bg-neutral-500 dark:border-dark-border dark:shadow-dark-storage' : ''
                                }`}
                            >
                                <NewTaskIcon />
                                <h3 className={activeTab === 'docSettings' ? 'text-medium-14 dark:text-medium-14-white' : 'text-regular-14-neutral-500'}>Doc settings</h3>
                            </button>
                            
                            {/* تب Edit Access - فقط وقتی لینک نیست */}
                            <button
                                onClick={() => !hasSharedLink && setActiveTab('editAccess')}
                                disabled={hasSharedLink}
                                className={`flex  items-center justify-center gap-2.5 py-1 px-[9px] self-stretch rounded-[5px] transition-all  ${
                                    activeTab === 'editAccess' && !hasSharedLink 
                                        ? 'border border-[#F2F2F3] bg-white shadow-middle dark:bg-neutral-500 dark:border-dark-border dark:shadow-dark-storage' 
                                        : hasSharedLink
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                }`}
                            >
                                <AccessLinkIcon />
                                <h3 className={
                                    activeTab === 'editAccess' && !hasSharedLink 
                                        ? 'text-medium-14 dark:text-medium-14-white' 
                                        : hasSharedLink
                                            ? 'text-regular-14-neutral-300'
                                            : 'text-regular-14-neutral-500'
                                }>
                                    Edit access link
                                </h3>
                            </button>
                            
                            {/* تب View Only - فقط وقتی لینک هست */}
                            <button
                                onClick={() => hasSharedLink && setActiveTab('viewOnly')}
                                disabled={!hasSharedLink}
                                className={`flex flex-1 items-center justify-center gap-2.5 py-1 px-[9px] self-stretch rounded-[5px] transition-all ${
                                    activeTab === 'viewOnly' && hasSharedLink 
                                        ? 'border border-[#F2F2F3] bg-white shadow-middle dark:bg-neutral-500 dark:border-dark-border dark:shadow-dark-storage' 
                                        : !hasSharedLink
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                }`}
                            >
                                <ViewOnlyLinkIcon />
                                <h3 className={
                                    activeTab === 'viewOnly' && hasSharedLink 
                                        ? 'text-medium-14 dark:text-medium-14-white' 
                                        : !hasSharedLink
                                            ? 'text-regular-14-neutral-300'
                                            : 'text-regular-14-neutral-500'
                                }>
                                    View-only link
                                </h3>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 pt-6 pr-2 -mr-4 min-h-0">
                    {renderContent()}
                </div>

                {/* بخش پایینی: فوتر */}
                <div className="flex-shrink-0 pt-6">
                    <div className='flex justify-end items-center gap-3 self-stretch'>
                        <button className='flex h-8 items-center justify-center gap-2 rounded-lg border border-[#ECECEE] bg-white py-[13px] px-6 text-center text-medium-14 dark:text-medium-14-white shadow-light dark:bg-dark-gradient dark:shadow-dark-panel dark:border-dark-border'>
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