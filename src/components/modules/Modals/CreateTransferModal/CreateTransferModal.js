"use client";

import React, { useState } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { CloseIcon, UploadIcon } from '@/components/ui/icons';
import useModalStore from '@/store/ui/modalStore';

const CreateTransferModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen } = modals.createTransfer || {};
    const [isDragging, setIsDragging] = useState(false);

    const handleClose = () => {
        closeModal('createTransfer');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        console.log('Dropped files:', files);
        // اینجا می‌تونی فایل‌ها رو آپلود کنی
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        console.log('Selected files:', files);
        // اینجا می‌تونی فایل‌ها رو آپلود کنی
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='520px'>
            <div className="w-full">
                {/* Header */}
                <div className='flex justify-between items-center self-stretch'>
                    <h2 className='text-medium-18'>Create transfer</h2>
                    <button
                        onClick={handleClose}
                        className='flex justify-center items-center w-8 h-8 rounded-lg border border-[#ECECEE] bg-white shadow-light hover:bg-gray-50 transition-colors'
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Drag & Drop Area */}
                <div className='flex flex-col items-center gap-6 self-stretch mt-6'>
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            flex flex-col justify-center items-center gap-4 self-stretch
                            py-12 px-6 rounded-lg border-2 border-dashed transition-all duration-200
                            ${isDragging
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-stroke-300 bg-gray-50'
                            }
                        `}
                    >
                        <div className="rounded-lg bg-gradient-to-t from-[#9B9B9E] to-[#CDCDD1] shadow-[inset_0_-1px_1px_0_rgba(0,0,0,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.40)] flex w-8 h-8 p-1 justify-center items-center gap-2 flex-shrink-0 aspect-square">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                <path d="M10.5 2.75V5.75C10.5 5.94891 10.579 6.13968 10.7197 6.28033C10.8603 6.42098 11.0511 6.5 11.25 6.5H14.25M10.5 2.75H5.25C4.85218 2.75 4.47064 2.90804 4.18934 3.18934C3.90804 3.47064 3.75 3.85218 3.75 4.25V14.75C3.75 15.1478 3.90804 15.5294 4.18934 15.8107C4.47064 16.092 4.85218 16.25 5.25 16.25H12.75C13.1478 16.25 13.5294 16.092 13.8107 15.8107C14.092 15.5294 14.25 15.1478 14.25 14.75V6.5M10.5 2.75L14.25 6.5M9 8.75V13.25M9 8.75L7.125 10.625M9 8.75L10.875 10.625" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p className='text-regular-14 text-neutral-400 text-center'>
                            Drag and drop files here to upload
                        </p>
                    </div>

                    {/* Upload Button */}
                    <label className='flex justify-center items-center gap-1.5 h-10 py-3 px-6 rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95'>
                        <UploadIcon />
                        <input
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            className='hidden'
                        />
                        Upload file
                    </label>
                </div>
            </div>
        </BaseModal>
    );
};

export default CreateTransferModal;