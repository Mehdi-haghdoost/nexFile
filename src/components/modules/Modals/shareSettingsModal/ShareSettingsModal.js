"use client";
import React, { useState, useEffect } from 'react';
import useModalStore from '@/store/ui/modalStore';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { AccessLinkIcon, BackArrowIcon, CloseIcon, NewTaskIcon, ViewOnlyLinkIcon } from '@/components/ui/icons';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import DocSettingsContent from './DocSettingsContent';
import EditAccessLinkContent from './EditAccessLinkContent';
import ViewOnlyLinkContent from './ViewOnlyLinkContent';

const ShareSettingsModal = () => {
    const [activeTab, setActiveTab] = useState('docSettings');
    const [isCommentsEnabled, setIsCommentsEnabled] = useState(false);
    const [permissionLevel, setPermissionLevel] = useState('folder-member');
    const [isLoading, setIsLoading] = useState(false);

    // Whether a share link currently exists for this item
    const [hasSharedLink, setHasSharedLink] = useState(false);

    // Share-link settings shown in the View-only tab
    const [accessLevel, setAccessLevel] = useState('anyone');
    const [isExpirationEnabled, setIsExpirationEnabled] = useState(false);
    const [expirationDate, setExpirationDate] = useState('');
    const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
    const [password, setPassword] = useState('');
    const [disableDownloads, setDisableDownloads] = useState(false);

    // Organization policy that constrains what link settings are allowed
    const [orgPolicy, setOrgPolicy] = useState(null);

    const { modals, closeModal, openModal } = useModalStore();
    const { isOpen, data } = modals.shareSettings || {};

    const fileName = data?.fileName || 'Untitled';
    const fileId = data?.fileId;
    const fileType = data?.fileType || 'folder';

    useEffect(() => {
        if (!isOpen) return;

        const loadPolicy = async () => {
            try {
                const res = await fetch('/api/admin/security', { credentials: 'include' });
                const result = await res.json();
                if (res.ok && result.success) {
                    setOrgPolicy(result.security);
                    // Pre-enable whatever the organization requires
                    if (result.security?.linkPassword) setIsPasswordEnabled(true);
                    if (result.security?.linkExpiration) setIsExpirationEnabled(true);
                }
            } catch (error) {
                console.log('Failed to load org policy:', error);
            }
        };

        loadPolicy();
    }, [isOpen]);

    const handleClose = () => {
        closeModal('shareSettings');
        setActiveTab('docSettings');
    };

    // Return to whichever modal opened this one
    const handleBack = () => {
        const returnTo = data?.returnTo;
        closeModal('shareSettings');

        if (returnTo) {
            openModal(returnTo, data);
        }
    };

    // A link was just created
    const handleLinkCreated = () => {
        setHasSharedLink(true);
        setActiveTab('viewOnly');
    };

    // The link was deleted; reset its settings, keeping org requirements on
    const handleLinkDeleted = () => {
        setHasSharedLink(false);
        setAccessLevel('anyone');
        setIsExpirationEnabled(Boolean(orgPolicy?.linkExpiration));
        setExpirationDate('');
        setIsPasswordEnabled(Boolean(orgPolicy?.linkPassword));
        setPassword('');
        setDisableDownloads(false);
        setActiveTab('editAccess');
    };

    const handleSave = async () => {
        if (!fileId) {
            showErrorToast('File ID is missing');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/api/files/${fileId}/permissions`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    permissionLevel,
                    isCommentsEnabled,
                    accessLevel: hasSharedLink ? accessLevel : undefined,
                    isExpirationEnabled: hasSharedLink ? isExpirationEnabled : undefined,
                    expirationDate: hasSharedLink && isExpirationEnabled ? expirationDate : undefined,
                    isPasswordEnabled: hasSharedLink ? isPasswordEnabled : undefined,
                    password: hasSharedLink && isPasswordEnabled ? password : undefined,
                    disableDownloads: hasSharedLink ? disableDownloads : undefined,
                    itemType: fileType
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save permissions');
            }

            showSuccessToast('Permissions updated successfully!');

            // Return to the previous modal if there was one
            if (data?.returnTo) {
                closeModal('shareSettings');
                openModal(data.returnTo, data);
            } else {
                handleClose();
            }
        } catch (error) {
            console.error('Save permissions error:', error);
            showErrorToast(error.message || 'Failed to save permissions');
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'docSettings':
                return <DocSettingsContent
                    isCommentsEnabled={isCommentsEnabled}
                    setIsCommentsEnabled={setIsCommentsEnabled}
                    permissionLevel={permissionLevel}
                    setPermissionLevel={setPermissionLevel}
                    fileName={fileName}
                />;
            case 'editAccess':
                return <EditAccessLinkContent
                    onLinkCreated={handleLinkCreated}
                />;
            case 'viewOnly':
                return <ViewOnlyLinkContent
                    onLinkDeleted={handleLinkDeleted}
                    accessLevel={accessLevel}
                    setAccessLevel={setAccessLevel}
                    isExpirationEnabled={isExpirationEnabled}
                    setIsExpirationEnabled={setIsExpirationEnabled}
                    expirationDate={expirationDate}
                    setExpirationDate={setExpirationDate}
                    isPasswordEnabled={isPasswordEnabled}
                    setIsPasswordEnabled={setIsPasswordEnabled}
                    password={password}
                    setPassword={setPassword}
                    disableDownloads={disableDownloads}
                    setDisableDownloads={setDisableDownloads}
                    orgPolicy={orgPolicy}
                />;
            default:
                return <DocSettingsContent
                    isCommentsEnabled={isCommentsEnabled}
                    setIsCommentsEnabled={setIsCommentsEnabled}
                    permissionLevel={permissionLevel}
                    setPermissionLevel={setPermissionLevel}
                    fileName={fileName}
                />;
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width="520px">
            <div className="w-full flex flex-col max-h-[85vh]">
                {/* Header and tabs */}
                <div className="flex-shrink-0">
                    <div className='flex flex-col items-start gap-4 sm:gap-6 self-stretch'>
                        {/* Header */}
                        <div className='flex items-center justify-between gap-2 self-stretch'>
                            <div className='flex items-center gap-2 sm:gap-3 flex-1 min-w-0'>
                                {data?.returnTo && (
                                    <button
                                        onClick={handleBack}
                                        disabled={isLoading}
                                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors shrink-0 disabled:opacity-50"
                                    >
                                        <BackArrowIcon />
                                    </button>
                                )}
                                <h3 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white truncate'>
                                    Settings for {fileType} "{fileName}"
                                </h3>
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={isLoading}
                                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors shrink-0 disabled:opacity-50"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className='flex justify-center items-center gap-0.5 sm:gap-1 h-8 sm:h-9 w-full p-0.5 rounded-lg border border-[#ECECEE] bg-[#F6F6F7] dark:border-primary-500 dark:bg-neutral-900 overflow-x-auto'>
                            {/* Doc settings tab */}
                            <button
                                onClick={() => setActiveTab('docSettings')}
                                disabled={isLoading}
                                className={`flex flex-1 items-center justify-center gap-1 sm:gap-1.5 py-1 px-2 sm:px-[9px] self-stretch rounded-lg transition-all whitespace-nowrap min-w-0 disabled:opacity-50 ${activeTab === 'docSettings'
                                    ? 'border border-[#F2F2F3] bg-white shadow-middle dark:bg-neutral-500 dark:border-dark-border dark:shadow-dark-storage'
                                    : ''
                                    }`}
                            >
                                <NewTaskIcon className="w-4 h-4 shrink-0" />
                                <h3 className={`text-xs sm:text-sm truncate ${activeTab === 'docSettings'
                                    ? 'font-medium text-neutral-500 dark:text-white'
                                    : 'font-normal text-neutral-500 dark:text-neutral-300'
                                    }`}>
                                    Doc settings
                                </h3>
                            </button>

                            {/* Edit access tab */}
                            <button
                                onClick={() => !hasSharedLink && setActiveTab('editAccess')}
                                disabled={hasSharedLink || isLoading}
                                className={`flex flex-1 items-center justify-center gap-1 sm:gap-2.5 py-1 px-2 sm:px-[9px] self-stretch rounded-[5px] transition-all whitespace-nowrap min-w-0 ${activeTab === 'editAccess' && !hasSharedLink
                                    ? 'border border-[#F2F2F3] bg-white shadow-middle dark:bg-neutral-500 dark:border-dark-border dark:shadow-dark-storage'
                                    : hasSharedLink
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                    }`}
                            >
                                <AccessLinkIcon className="w-4 h-4 shrink-0" />
                                <h3 className={`text-xs sm:text-sm truncate ${activeTab === 'editAccess' && !hasSharedLink
                                    ? 'font-medium text-neutral-500 dark:text-white'
                                    : hasSharedLink
                                        ? 'font-normal text-neutral-300 dark:text-neutral-400'
                                        : 'font-normal text-neutral-500 dark:text-neutral-300'
                                    }`}>
                                    Edit access
                                </h3>
                            </button>

                            {/* View-only tab */}
                            <button
                                onClick={() => hasSharedLink && setActiveTab('viewOnly')}
                                disabled={!hasSharedLink || isLoading}
                                className={`flex flex-1 items-center justify-center gap-1 sm:gap-2.5 py-1 px-2 sm:px-[9px] self-stretch rounded-[5px] transition-all whitespace-nowrap min-w-0 ${activeTab === 'viewOnly' && hasSharedLink
                                    ? 'border border-[#F2F2F3] bg-white shadow-middle dark:bg-neutral-500 dark:border-dark-border dark:shadow-dark-storage'
                                    : !hasSharedLink
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                    }`}
                            >
                                <ViewOnlyLinkIcon className="w-4 h-4 shrink-0" />
                                <h3 className={`text-xs sm:text-sm truncate ${activeTab === 'viewOnly' && hasSharedLink
                                    ? 'font-medium text-neutral-500 dark:text-white'
                                    : !hasSharedLink
                                        ? 'font-normal text-neutral-300 dark:text-neutral-400'
                                        : 'font-normal text-neutral-500 dark:text-neutral-300'
                                    }`}>
                                    View-only
                                </h3>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Organization policy notice */}
                {(orgPolicy?.linkPassword || orgPolicy?.linkExpiration) && (
                    <div className="flex-shrink-0 mt-3">
                        <div className="rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-3 py-2">
                            <p className="text-xs text-amber-700 dark:text-amber-400">
                                Your organization requires share links to have
                                {orgPolicy.linkPassword && ' a password'}
                                {orgPolicy.linkPassword && orgPolicy.linkExpiration && ' and'}
                                {orgPolicy.linkExpiration && ' an expiration date'}.
                            </p>
                        </div>
                    </div>
                )}

                {/* Scrollable content */}
                <div className="flex-1 pt-4 sm:pt-6 pr-2 -mr-4 min-h-0 overflow-y-auto custom-scrollbar">
                    {renderContent()}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 pt-4 sm:pt-6">
                    <div className='flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-2 sm:gap-3 self-stretch'>
                        <button
                            onClick={handleBack}
                            disabled={isLoading}
                            className='w-full sm:w-auto flex h-9 sm:h-8 items-center justify-center gap-2 rounded-lg border border-[#ECECEE] bg-white py-2 sm:py-[13px] px-4 sm:px-6 text-center text-xs sm:text-sm font-medium text-neutral-500 dark:text-white shadow-light dark:bg-dark-gradient dark:shadow-dark-panel dark:border-dark-border hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50'
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="w-full sm:w-auto flex h-9 sm:h-8 items-center justify-center gap-2 rounded-lg border border-[#5749BF] bg-gradient-primary py-2 sm:py-[13px] px-4 sm:px-6 text-center text-xs sm:text-sm font-medium text-white shadow-heavy hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                'Save'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default ShareSettingsModal;