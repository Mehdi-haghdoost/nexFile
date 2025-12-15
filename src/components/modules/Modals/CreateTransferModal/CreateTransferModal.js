"use client";

import React, { useState } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { CloseCircleIcon, CloseIcon, EmailIcon, LinkIcon, SettingsIcon, UploadIcon } from '@/components/ui/icons';
import useModalStore from '@/store/ui/modalStore';
import useTransferStore from '@/store/features/transfer/transferStore';
import useTransferFiles from '@/hooks/createTransferModal/useTransferFiles';
import FileIcon from '@/components/ui/FileIcon';
import TransferSuccessView from '@/components/templates/transfer/TransferSuccessView';

const CreateTransferModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen } = modals.createTransfer || {};

    const {
        files,
        isDragging,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleFileSelect,
        removeFile,
        clearFiles,
    } = useTransferFiles();

    const { addTransfer } = useTransferStore();

    const [transferType, setTransferType] = useState('link');
    const [view, setView] = useState('upload');
    const [shareLink, setShareLink] = useState('');

    const handleClose = () => {
        closeModal('createTransfer');
        clearFiles();
        setTransferType('link');
        setView('upload');
        setShareLink('');
    };

    const handleCreateTransfer = async () => {
        try {
            console.log('Creating transfer with:', { files, transferType });

            await new Promise(resolve => setTimeout(resolve, 1000));

            const generatedLink = `https://nexfile.com/transfer/${Date.now()}`;
            setShareLink(generatedLink);

            setView('success');
        } catch (error) {
            console.error('Error creating transfer:', error);
            alert('Failed to create transfer');
        }
    };

    const handleBackToUpload = () => {
        setView('upload');
    };

    const handleManageTransfer = () => {
        console.log('Manage transfer:', shareLink);
        alert('Opening transfer management...');
    };

    const handleSendEmail = () => {
        const transfer = {
            id: Date.now().toString(),
            groupName: files[0]?.name || 'Untitled Transfer',
            filesCount: files.length,
            createdAt: new Date().toISOString(),
            expirationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            downloadCount: 0,
            viewCount: 0,
            link: shareLink,
            files: files,
            type: transferType,
        };

        addTransfer(transfer);

        console.log('Transfer sent via email:', transfer);
        alert('Transfer sent successfully!');

        handleClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='520px'>
            <div className="w-full">
                {/* Header */}
                <div className='flex justify-between items-center gap-2 self-stretch mb-4 sm:mb-6'>
                    <h2 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white truncate'>
                        {view === 'upload' ? 'Create transfer' : 'Transfer Ready'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className='btn-icon-elegant shrink-0'
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Views */}
                {view === 'upload' ? (
                    <div className='animate-in fade-in-0 slide-in-from-left-5 duration-300'>
                        {files.length === 0 ? (
                            /* Drag & Drop Area - Initial State */
                            <div className='flex flex-col items-center gap-4 sm:gap-6 self-stretch'>
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`
                                        flex flex-col justify-center items-center gap-3 sm:gap-4 self-stretch
                                        py-8 sm:py-12 px-4 sm:px-6 rounded-lg border-2 border-dashed transition-all duration-200 dark:bg-neutral-900 dark:border-neutral-700
                                        ${isDragging
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-bg'
                                            : 'border-stroke-300 bg-gray-50'
                                        }
                                    `}
                                >
                                    <div className="rounded-lg bg-gradient-to-t from-[#9B9B9E] to-[#CDCDD1] shadow-[inset_0_-1px_1px_0_rgba(0,0,0,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.40)] flex w-7 h-7 sm:w-8 sm:h-8 p-1 justify-center items-center gap-2 flex-shrink-0 aspect-square dark:bg-dark-neutral-gradient dark:border-dark-white-70">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 18 19" fill="none" className="sm:w-[18px] sm:h-[19px]">
                                            <path d="M10.5 2.75V5.75C10.5 5.94891 10.579 6.13968 10.7197 6.28033C10.8603 6.42098 11.0511 6.5 11.25 6.5H14.25M10.5 2.75H5.25C4.85218 2.75 4.47064 2.90804 4.18934 3.18934C3.90804 3.47064 3.75 3.85218 3.75 4.25V14.75C3.75 15.1478 3.90804 15.5294 4.18934 15.8107C4.47064 16.092 4.85218 16.25 5.25 16.25H12.75C13.1478 16.25 13.5294 16.092 13.8107 15.8107C14.092 15.5294 14.25 15.1478 14.25 14.75V6.5M10.5 2.75L14.25 6.5M9 8.75V13.25M9 8.75L7.125 10.625M9 8.75L10.875 10.625" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <p className='text-xs sm:text-sm text-neutral-400 dark:text-white text-center px-4'>
                                        Drag and drop files here to upload
                                    </p>
                                </div>

                                <label className='w-full sm:w-auto flex justify-center items-center gap-1.5 h-9 sm:h-10 py-2 sm:py-3 px-4 sm:px-6 rounded-lg border border-stroke-300 bg-white shadow-light text-xs sm:text-sm font-medium text-neutral-500 dark:text-white cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 dark:bg-dark-gradient dark:border-dark-border'>
                                    <UploadIcon className="w-4 h-4" />
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileSelect}
                                        className='hidden'
                                    />
                                    Upload file
                                </label>
                            </div>
                        ) : (
                            /* File List View */
                            <div className='flex flex-col gap-4 sm:gap-6'>
                                {/* File Info Section */}
                                <div
                                    className='flex flex-col items-start gap-3 sm:gap-4 self-stretch'
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className='flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0 w-full'>
                                        {/* Link/Email Tabs */}
                                        <div className='flex items-center h-8 gap-0.5 sm:gap-1 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100 dark:bg-neutral-900 dark:border-neutral-700'>
                                           <button
    onClick={() => setTransferType('link')}
    className={`
        flex flex-1 justify-center items-center py-1 pr-3 sm:pr-4 pl-2 sm:pl-3 gap-1.5 sm:gap-2.5 self-stretch rounded-lg 
        transition-[border,box-shadow,transform,color,opacity] text-xs sm:text-sm font-medium
        ${transferType === 'link'
            ? 'border border-stroke-200 bg-white shadow-middle scale-100 text-neutral-500 dark:text-white dark:border-dark-border dark:bg-dark-gradient'
            : 'border border-transparent bg-transparent scale-95 hover:scale-100 text-neutral-500 dark:text-neutral-300'
        }
    `}
>
    <LinkIcon className="w-4 h-4 shrink-0" />
    <span className="hidden sm:inline">Link</span>
</button>

<button
    onClick={() => setTransferType('email')}
    className={`
        flex flex-1 justify-center items-center py-1 pr-3 sm:pr-4 pl-2 sm:pl-3 gap-1.5 sm:gap-2.5 self-stretch rounded-lg 
        transition-[border,box-shadow,transform,color,opacity] text-xs sm:text-sm font-medium
        ${transferType === 'email'
            ? 'border border-stroke-200 bg-white shadow-middle scale-100 text-neutral-500 dark:text-white dark:border-dark-border dark:bg-dark-gradient'
            : 'border border-transparent bg-transparent scale-95 hover:scale-100 text-neutral-500 dark:text-neutral-300'
        }
    `}
>
    <EmailIcon className="w-4 h-4 shrink-0" />
    <span className="hidden sm:inline">Email</span>
</button>
                                        </div>

                                        {/* Upload More Files Button */}
                                        <label className='flex justify-center items-center gap-1 sm:gap-1.5 h-8 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg border border-stroke-300 bg-white shadow-light text-xs sm:text-sm font-medium text-neutral-500 dark:text-white cursor-pointer transition-all duration-200 hover:border-gray-400 hover:shadow-md active:scale-95 dark:bg-dark-gradient dark:border-dark-border'>
                                            <UploadIcon className="w-4 h-4 shrink-0" />
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleFileSelect}
                                                className='hidden'
                                            />
                                            <span className="hidden sm:inline">Upload file</span>
                                        </label>
                                    </div>

                                    {/* Files Count */}
                                    <p className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400'>
                                        {files.length} {files.length === 1 ? 'file' : 'files'}
                                    </p>

                                    {/* Files List */}
                                    <div className={`
                                        files-list-container flex flex-col gap-2 max-h-[180px] sm:max-h-[200px] overflow-y-auto custom-scrollbar w-full
                                        ${isDragging ? 'border-2 border-dashed border-primary-500 bg-primary-50 rounded-lg p-2 dark:bg-primary-bg dark:border-primary-border' : ''}
                                    `}>
                                        {files.map((file) => (
                                            <div
                                                key={file.id}
                                                className='flex justify-between items-center p-2 sm:p-3 rounded-lg border border-stroke-200 bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 gap-2'
                                            >
                                                <div className='flex items-center gap-2 self-stretch min-w-0 flex-1'>
                                                    <FileIcon extension={file.extension} className="shrink-0" />
                                                    <div className='flex flex-col gap-0.5 sm:gap-1 min-w-0 flex-1'>
                                                        <p className='text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate'>{file.name}</p>
                                                        <p className='text-xs text-gray-500 dark:text-neutral-300'>{file.size}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeFile(file.id)}
                                                    className='flex justify-center items-center w-4 h-4 shrink-0 hover:opacity-70 transition-opacity'
                                                >
                                                    <CloseCircleIcon />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className='flex flex-col sm:flex-row justify-between items-stretch sm:items-end gap-3 sm:gap-0 mt-2 sm:mt-4'>
                                    <div className='flex flex-1 items-center gap-2 sm:gap-3'>
                                        <button className='flex justify-center items-center w-8 h-8 rounded-lg border border-[#ECECEE] bg-white shadow-light hover:bg-gray-50 transition-colors dark:border-dark-border dark:bg-dark-gradient shrink-0'>
                                            <SettingsIcon />
                                        </button>

                                        <div className='flex flex-col items-start justify-center gap-0.5 min-w-0'>
                                            <p className='text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate w-full'>Expired on 2/14/2025</p>
                                            <p className='text-xs text-gray-500 dark:text-neutral-200 truncate w-full'>No password needed</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCreateTransfer}
                                        className='w-full sm:w-auto flex justify-center items-center gap-1 sm:gap-1.5 h-9 sm:h-10 py-2 sm:py-3 px-4 sm:px-6 rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] shadow-light text-xs sm:text-sm font-medium text-white transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95'
                                    >
                                        Create transfer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <TransferSuccessView
                        shareLink={shareLink}
                        onBack={handleBackToUpload}
                        onManage={handleManageTransfer}
                        onSendEmail={handleSendEmail}
                    />
                )}
            </div>
        </BaseModal>
    );
};

export default CreateTransferModal;