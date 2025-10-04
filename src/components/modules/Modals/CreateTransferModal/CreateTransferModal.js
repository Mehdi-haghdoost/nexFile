"use client";

import React, { useState } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { CloseCircleIcon, CloseIcon, LinkIcon, SettingsIcon, UploadIcon } from '@/components/ui/icons';
import useModalStore from '@/store/ui/modalStore';
import useTransferFiles from '@/hooks/createTransferModal/useTransferFiles';
import FileIcon from '@/components/ui/FileIcon';

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

    const [transferType, setTransferType] = useState('link');

    const handleClose = () => {
        closeModal('createTransfer');
        clearFiles();
        setTransferType('link');
    };

    const handleCreateTransfer = () => {
        console.log('Creating transfer with:', { files, transferType });
        // اینجا API call برای ساخت transfer
        handleClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='520px'>
            <div className="w-full">
                {/* Header */}
                <div className='flex justify-between items-center self-stretch mb-6'>
                    <h2 className='text-medium-18'>Create transfer</h2>
                    <button
                        onClick={handleClose}
                        className='flex justify-center items-center w-8 h-8 rounded-lg border border-[#ECECEE] bg-white shadow-light hover:bg-gray-50 transition-colors'
                    >
                        <CloseIcon />
                    </button>
                </div>

                {files.length === 0 ? (
                    /* Drag & Drop Area - Initial State */
                    <div className='flex flex-col items-center gap-6 self-stretch'>
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
                ) : (
                    /* File List View */
                    <div className='flex flex-col gap-6'>
                        {/* File Info Section */}
                        <div
                            className='flex flex-col items-start gap-4 self-stretch'
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className='flex justify-between items-center w-full'>
                                {/* Link/Email Tabs */}
                                <div className='flex items-center h-8 gap-1 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100'>
                                    <button
                                        onClick={() => setTransferType('link')}
                                        className={`
                                            flex justify-center items-center py-1 pr-4 pl-3 gap-2.5 self-stretch rounded-lg 
                                            transition-all duration-300 ease-in-out
                                            ${transferType === 'link'
                                                ? 'border border-stroke-200 bg-white shadow-middle scale-100'
                                                : 'border border-transparent bg-transparent scale-95 '
                                            }
                                        `}
                                    >
                                        <LinkIcon />
                                        Link
                                    </button>
                                    <button
                                        onClick={() => setTransferType('email')}
                                        className={`
                                            flex justify-center items-center py-1 pr-4 pl-3 gap-2.5 self-stretch rounded-lg 
                                            transition-all duration-300 ease-in-out
                                            ${transferType === 'email'
                                                ? 'border border-stroke-200 bg-white shadow-middle scale-100'
                                                : 'border border-transparent bg-transparent scale-95 '
                                            }
                                        `}
                                    >
                                        Email
                                    </button>
                                </div>

                                {/* Upload More Files Button */}
                                <label className='flex justify-center items-center gap-1.5 h-8 py-2 px-4 rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 cursor-pointer transition-all duration-200 hover:border-gray-400 hover:shadow-md active:scale-95'>
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

                            {/* Files Count */}
                            <p className='text-medium-14'>
                                {files.length} {files.length === 1 ? 'file' : 'files'}
                            </p>

                            {/* Files List */}
                            <div className={`
                                flex flex-col gap-2 max-h-[200px] overflow-y-auto w-full
                                ${isDragging ? 'border-2 border-dashed border-primary-500 bg-primary-50 rounded-lg p-2' : ''}
                            `}>
                                {files.map((file) => (
                                    <div
                                        key={file.id}
                                        className='flex justify-between items-center p-3 rounded-lg border border-stroke-200 bg-gray-50'
                                    >
                                        <div className='flex items-center gap-2 self-stretch'>
                                            <FileIcon extension={file.extension} />
                                            <div className='flex flex-col gap-1'>
                                                <p className='text-medium-14 text-gray-900'>{file.name}</p>
                                                <p className='text-regular-12 text-gray-500'>{file.size}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFile(file.id)}
                                            className='flex justify-center items-center w-4 h-4'
                                        >
                                            <CloseCircleIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className='flex justify-between items-end mt-4'>
                            <div className='flex flex-1 items-center gap-3'>
                                <button className='flex justify-center items-center w-8 h-8 rounded-lg border border-[#ECECEE] bg-white shadow-light hover:bg-gray-50 transition-colors'>
                                    <SettingsIcon />
                                </button>

                                <div className='flex flex-col items-start justify-center gap-0.5'>
                                    <p className='text-medium-14 text-gray-900'>Expired on 2/14/2025</p>
                                    <p className='text-regular-12 text-gray-500'>No password needed</p>
                                </div>
                            </div>

                            <button
                                onClick={handleCreateTransfer}
                                className='flex justify-center items-center gap-1.5 h-10 py-3 px-6 rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] shadow-light text-medium-14-white transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95'
                            >
                                Create transfer
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

export default CreateTransferModal;