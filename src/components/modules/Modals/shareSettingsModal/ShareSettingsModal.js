"use client";
import React from 'react';
import useModalStore from '@/store/modalStore';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { CloseIcon } from '@/components/ui/icons';

const ShareSettingsModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen, data } = modals.shareSettings || {};

    const handleClose = () => {
        closeModal('shareSettings');
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width="520px">
            <div className="w-full">
                {/* Form Content */}
                <div className='flex flex-col items-start gap-6 self-stretch'>
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
                        <div></div>
                        {/* Settings Info */}
                        <div></div>
                        {/* Permissions Section */}
                        <div></div>
                    </div>
                </div>
                {/* Footer */}
                <div className='flex flex-end items-center gap-3 self-stretch'></div>
            </div>
        </BaseModal>
    );
};

export default ShareSettingsModal;
