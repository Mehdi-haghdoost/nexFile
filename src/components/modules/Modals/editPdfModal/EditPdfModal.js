'use client';
import BaseModal from '@/components/layouts/Modal/BaseModal'
import { CloseIcon, FileIcon, SearchIcon, UploadIcon } from '@/components/ui/icons';
import { useFolders } from '@/hooks/createFileModal/useFolders';
import useModalStore from '@/store/modalStore';
import React, { useState } from 'react'
import FolderItem from '../CreateFileModal/FolderItem';

const EditPdfModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen, data } = modals.editPdf;
    const { folders, isLoading, error, isCreatingFile, refreshFolders, createFileInFolder } = useFolders();
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleClose = () => {
        closeModal('editPdf');
    };

    const renderFolderList = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin mb-2"></div>
                    <p className="text-regular-12 text-gray-500">Loading folders...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-regular-12 text-red-500 mb-2">Failed to load folders</p>
                    <button
                        onClick={refreshFolders}
                        className="text-primary-500 text-regular-12 hover:underline"
                    >
                        Try again
                    </button>
                </div>
            );
        }

        if (!folders || folders.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-regular-12 text-gray-500">No folders available</p>
                </div>
            );
        }

        return (
            <div className='flex flex-col items-start self-stretch p-1'>
                {folders.map((folder) => (
                    <div key={folder.id} className='w-full'>
                        <FolderItem
                            folder={folder}
                            isSelected={selectedFolder?.id === folder.id}
                            onSelect={handleFolderSelect}
                        />

                        {/* نمایش فایل‌های داخل فولدر انتخاب شده */}
                        {selectedFolder?.id === folder.id && folder.files && folder.files.length > 0 && (
                            <div className='ml-6 mt-2 flex flex-col gap-1'>
                                {folder.files.map((file) => (
                                    <div
                                        key={file.id}
                                        onClick={() => handleFileSelect(file)}
                                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${selectedFile?.id === file.id
                                            ? 'bg-primary-500/10 border border-primary-500'
                                            : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <FileIcon />
                                        <span className="text-regular-12 text-gray-700">{file.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* پیام برای فولدر خالی */}
                        {selectedFolder?.id === folder.id && (!folder.files || folder.files.length === 0) && (
                            <div className='ml-6 mt-2 p-2 text-regular-12 text-gray-400'>
                                No PDF files found in this folder
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const handleFolderSelect = (folder) => {
        if (selectedFolder?.id === folder.id) {
            setSelectedFolder(null);
            setSelectedFile(null);
        } else {
            setSelectedFolder(folder);
            setSelectedFile(null);
        }
    };

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    const isChooseButtonEnabled = selectedFile !== null;

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='520px'>
            <div className='w-full'>
                {/* Form Section */}
                <div className='flex flex-col items-start gap-6 self-stretch'>
                    {/* Form Header */}
                    <div className='flex items-center justify-between self-stretch'>
                        <h3 className='text-medium-18'>Select a PDF for editing</h3>
                        <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded">
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Search Section */}
                    <div className='flex flex-col items-start gap-4 self-stretch'>
                        {/* Search Pdf */}
                        <div className='flex items-center justify-center gap-2 p-3 h-8 self-stretch rounded-lg border border-[#E1E0E5] bg-white'>
                            <SearchIcon />
                            <input type="text" className='flex-1 text-regular-12-manrope outline-0' />
                        </div>

                        {/* Folder List with Scroll */}
                        <div className='w-full max-h-60 overflow-y-auto mb-8'>
                            {renderFolderList()}
                        </div>
                    </div>
                </div>

                {/* Form Footer */}
                <div className='flex items-center justify-between self-stretch'>
                    <button className='flex justify-center items-center gap-2 py-[13px] pr-4 pl-3 h-8 rounded-lg border border-[#ECECEE] bg-white shadow-light text-medium-14'>
                        <UploadIcon />
                        Upload file
                    </button>
                    <div className='flex items-center gap-3'>
                        <button className='flex items-center justify-center gap-2 py-[13px] px-6 h-8 rounded-lg border border-[#ECECEE] bg-white shadow-light text-medium-14'>
                            Cancel
                        </button>
                        <button
                            disabled={!isChooseButtonEnabled}
                            className={`flex items-center justify-center gap-2 py-[13px] px-6 h-8 rounded-lg border border-[#ECECEE] shadow-light ${isChooseButtonEnabled
                                ? 'bg-white text-medium-14'
                                : 'bg-stroke-100 text-medium-14-neutral-100'
                                }`}
                        >
                            Choose
                        </button>
                    </div>
                </div>
            </div>
        </BaseModal>
    )
}

export default EditPdfModal