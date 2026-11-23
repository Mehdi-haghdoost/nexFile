"use client";
import React, { useState, useEffect } from 'react';
import useModalStore from '@/store/ui/modalStore';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { AccessLinkIcon, BackArrowIcon, CloseIcon, NewTaskIcon, ViewOnlyLinkIcon } from '@/components/ui/icons';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { useItemSettings } from '@/hooks/sharing/useItemSettings';
import DocSettingsContent from './DocSettingsContent';
import EditAccessLinkContent from './EditAccessLinkContent';

const ACTIVE_TAB = 'border border-[#F2F2F3] bg-white shadow-middle dark:bg-neutral-500 dark:border-dark-border dark:shadow-dark-storage';

const ShareSettingsModal = () => {
    const [activeTab, setActiveTab] = useState('docSettings');
    const [permissionLevel, setPermissionLevel] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const { modals, closeModal, openModal } = useModalStore();
    const { isOpen, data } = modals.shareSettings || {};

    const fileName = data?.fileName || 'Untitled';
    const fileId = data?.fileId || null;
    const fileType = data?.fileType === 'file' ? 'file' : 'folder';
    const returnTo = data?.returnTo || null;

    // Loaded fresh each time it opens, so the form always starts from what is stored
    const { settings, isLoading, error, reload, save } = useItemSettings(isOpen ? fileId : null, fileType);

    useEffect(() => {
        if (isOpen) setActiveTab('docSettings');
    }, [isOpen, fileId]);

    useEffect(() => {
        setPermissionLevel(settings ? settings.controlLevel : null);
    }, [settings]);

    // Saving is offered only once something differs from what is stored
    const hasChanges = Boolean(settings && permissionLevel && permissionLevel !== settings.controlLevel);

    const handleClose = () => {
        if (isSaving) return;
        closeModal('shareSettings');
    };

    // Goes back to the modal that opened this one, for the same item
    const handleBack = () => {
        if (isSaving) return;
        closeModal('shareSettings');

        if (returnTo) {
            openModal(returnTo, { fileName, fileId, fileType });
        }
    };

    const handleSave = async () => {
        if (!hasChanges || isSaving) return;

        setIsSaving(true);
        try {
            // Only Control permissions is sent, so the hidden access information value stays as stored
            await save({ permissionLevel });
            showSuccessToast('Settings saved');
            handleAfterSave();
        } catch (err) {
            // A dead session already redirects to login inside fetchWithAuth
            if (err.message !== 'Session expired') showErrorToast(err.message || 'Failed to save the settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAfterSave = () => {
        closeModal('shareSettings');
        if (returnTo) openModal(returnTo, { fileName, fileId, fileType });
    };

    const renderBody = () => {
        if (!fileId) {
            return <p className='text-sm text-neutral-300 dark:text-neutral-300'>Choose a file or folder first.</p>;
        }

        // Someone who is not the owner is told why, not shown a form the server would refuse
        if (error?.status === 403) {
            return <p className='text-sm text-neutral-300 dark:text-neutral-300'>Only the owner can change these settings.</p>;
        }

        if (error) {
            return (
                <div className='flex items-center justify-between gap-3 rounded-lg border border-[#E1E0E5] dark:border-neutral-600 px-3 py-2'>
                    <p className='text-xs text-error-400'>{error.message}</p>
                    <button type='button' onClick={reload} className='text-xs font-medium text-primary-500 hover:underline shrink-0'>
                        Try again
                    </button>
                </div>
            );
        }

        if (!settings || !permissionLevel) {
            return (
                <div className='flex items-center justify-center gap-2 py-10'>
                    {isLoading && <div className='w-5 h-5 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin' />}
                    <p className='text-xs text-neutral-300'>Loading settings...</p>
                </div>
            );
        }

        if (activeTab === 'editAccess') return <EditAccessLinkContent />;

        return (
            <DocSettingsContent
                permissionLevel={permissionLevel}
                setPermissionLevel={setPermissionLevel}
                fileName={fileName}
                fileType={fileType}
                disabled={isSaving}
            />
        );
    };

    const canEditForm = Boolean(fileId && settings && !error);

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width="520px">
            <div className="w-full flex flex-col max-h-[85vh]">
                {/* Header and tabs */}
                <div className="flex-shrink-0">
                    <div className='flex flex-col items-start gap-4 sm:gap-6 self-stretch'>
                        {/* Header */}
                        <div className='flex items-center justify-between gap-2 self-stretch'>
                            <div className='flex items-center gap-2 sm:gap-3 flex-1 min-w-0'>
                                {returnTo && (
                                    <button
                                        onClick={handleBack}
                                        disabled={isSaving}
                                        aria-label='Back to sharing'
                                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors shrink-0 disabled:opacity-50"
                                    >
                                        <BackArrowIcon />
                                    </button>
                                )}
                                <h3 dir='auto' className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white truncate'>
                                    Settings for {fileType} "{fileName}"
                                </h3>
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={isSaving}
                                aria-label='Close'
                                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors shrink-0 disabled:opacity-50"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Tabs */}
                        {canEditForm && (
                            <div className='flex justify-center items-center gap-0.5 sm:gap-1 h-8 sm:h-9 w-full p-0.5 rounded-lg border border-[#ECECEE] bg-[#F6F6F7] dark:border-primary-500 dark:bg-neutral-900 overflow-x-auto'>
                                <button
                                    onClick={() => setActiveTab('docSettings')}
                                    disabled={isSaving}
                                    className={`flex flex-1 items-center justify-center gap-1 sm:gap-1.5 py-1 px-2 sm:px-[9px] self-stretch rounded-lg transition-all whitespace-nowrap min-w-0 disabled:opacity-50 ${activeTab === 'docSettings' ? ACTIVE_TAB : ''}`}
                                >
                                    <NewTaskIcon className="w-4 h-4 shrink-0" />
                                    <h3 className={`text-xs sm:text-sm truncate ${activeTab === 'docSettings' ? 'font-medium text-neutral-500 dark:text-white' : 'font-normal text-neutral-500 dark:text-neutral-300'}`}>
                                        Doc settings
                                    </h3>
                                </button>

                                <button
                                    onClick={() => setActiveTab('editAccess')}
                                    disabled={isSaving}
                                    className={`flex flex-1 items-center justify-center gap-1 sm:gap-2.5 py-1 px-2 sm:px-[9px] self-stretch rounded-[5px] transition-all whitespace-nowrap min-w-0 disabled:opacity-50 ${activeTab === 'editAccess' ? ACTIVE_TAB : ''}`}
                                >
                                    <AccessLinkIcon className="w-4 h-4 shrink-0" />
                                    <h3 className={`text-xs sm:text-sm truncate ${activeTab === 'editAccess' ? 'font-medium text-neutral-500 dark:text-white' : 'font-normal text-neutral-500 dark:text-neutral-300'}`}>
                                        Edit access
                                    </h3>
                                </button>

                                {/* Opens once public links exist */}
                                <button
                                    disabled
                                    title="Public links aren't available yet"
                                    className='flex flex-1 items-center justify-center gap-1 sm:gap-2.5 py-1 px-2 sm:px-[9px] self-stretch rounded-[5px] whitespace-nowrap min-w-0 opacity-50 cursor-not-allowed'
                                >
                                    <ViewOnlyLinkIcon className="w-4 h-4 shrink-0" />
                                    <h3 className='text-xs sm:text-sm truncate font-normal text-neutral-300 dark:text-neutral-400'>
                                        View-only
                                    </h3>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 pt-4 sm:pt-6 pr-2 -mr-4 min-h-0 overflow-y-auto custom-scrollbar">
                    {renderBody()}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 pt-4 sm:pt-6">
                    <div className='flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-2 sm:gap-3 self-stretch'>
                        <button
                            onClick={returnTo ? handleBack : handleClose}
                            disabled={isSaving}
                            className='w-full sm:w-auto flex h-9 sm:h-8 items-center justify-center gap-2 rounded-lg border border-[#ECECEE] bg-white py-2 sm:py-[13px] px-4 sm:px-6 text-center text-xs sm:text-sm font-medium text-neutral-500 dark:text-white shadow-light dark:bg-dark-gradient dark:shadow-dark-panel dark:border-dark-border hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50'
                        >
                            {returnTo ? 'Back' : 'Cancel'}
                        </button>
                        {canEditForm && (
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges || isSaving}
                                title={hasChanges ? undefined : 'No changes to save'}
                                className="w-full sm:w-auto flex h-9 sm:h-8 items-center justify-center gap-2 rounded-lg border border-[#5749BF] bg-gradient-primary py-2 sm:py-[13px] px-4 sm:px-6 text-center text-xs sm:text-sm font-medium text-white shadow-heavy hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    'Save'
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default ShareSettingsModal;