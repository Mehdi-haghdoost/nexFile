'use client';
import BaseModal from '@/components/layouts/Modal/BaseModal'
import { CloseIcon, FileIcon, SearchIcon, UploadIcon } from '@/components/ui/icons';
import { useFolders } from '@/hooks/files/createFileModal/useFolders';
import useModalStore from '@/store/ui/modalStore';
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

    // بررسی اینکه فایل PDF هست یا نه
    const isPdfFile = (fileName) => {
        return fileName && fileName.toLowerCase().endsWith('.pdf');
    };

    const renderFolderList = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin mb-2"></div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-300">Loading folders...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                    <p className="text-xs sm:text-sm text-red-500 dark:text-red-400 mb-2">Failed to load folders</p>
                    <button
                        onClick={refreshFolders}
                        className="text-primary-500 text-xs sm:text-sm hover:underline"
                    >
                        Try again
                    </button>
                </div>
            );
        }

        if (!folders || folders.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-300">No folders available</p>
                </div>
            );
        }

        return (
            <div className='flex flex-col items-start self-stretch p-0.5 sm:p-1'>
                {folders.map((folder) => (
                    <div key={folder.id} className='w-full'>
                        <FolderItem
                            folder={folder}
                            isSelected={selectedFolder?.id === folder.id}
                            onSelect={handleFolderSelect}
                        />

                        {/* نمایش فایل‌های داخل فولدر انتخاب شده */}
                        {selectedFolder?.id === folder.id && folder.files && folder.files.length > 0 && (
                            <div className='ml-4 sm:ml-6 mt-1.5 sm:mt-2 flex flex-col gap-0.5 sm:gap-1'>
                                {folder.files.filter(file => isPdfFile(file.name))
                                    .map((file) => (
                                        <div
                                            key={file.id}
                                            onClick={() => handleFileSelect(file)}
                                            className={`flex items-center gap-2 p-1.5 sm:p-2 rounded cursor-pointer transition-colors ${selectedFile?.id === file.id
                                                ? 'bg-primary-500/10 dark:bg-neutral-700'
                                                : 'hover:bg-gray-50 dark:hover:bg-neutral-700'
                                                }`}
                                        >
                                            <FileIcon className="w-4 h-4 shrink-0" />
                                            <span className="text-xs sm:text-sm text-gray-700 dark:text-neutral-200 truncate">{file.name}</span>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {/* پیام برای فولدر خالی */}
                        {selectedFolder?.id === folder.id && (!folder.files || folder.files.length === 0) && (
                            <div className='ml-4 sm:ml-6 mt-1.5 sm:mt-2 p-1.5 sm:p-2 text-xs sm:text-sm text-gray-400 dark:text-neutral-400'>
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
        // فقط فایل‌های PDF قابل انتخاب هستند
        if (isPdfFile(file.name)) {
            setSelectedFile(file);
        }
    };

    // دکمه فقط زمانی فعال باشد که فایل PDF انتخاب شده
    const isChooseButtonEnabled = selectedFile !== null && isPdfFile(selectedFile?.name);

    const handleChooseFile = () => {
        if (isChooseButtonEnabled) {
            // اینجا میشه فایل انتخاب شده رو به کامپوننت ویرایش PDF ارسال کنید
            console.log('Selected PDF file:', selectedFile);

            // مثال: باز کردن مدال ویرایش یا انتقال به صفحه ویرایش
            // openPdfEditor(selectedFile);

            handleClose();
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='520px'>
            <div className='w-full'>
                {/* Form Section */}
                <div className='flex flex-col items-start gap-4 sm:gap-6 self-stretch'>
                    {/* Form Header */}
                    <div className='flex items-center justify-between gap-2 self-stretch'>
                        <h3 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white truncate'>
                            Select a PDF for editing
                        </h3>
                        <button 
                            onClick={handleClose} 
                            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors shrink-0"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Search Section */}
                    <div className='flex flex-col items-start gap-3 sm:gap-4 self-stretch'>
                        {/* Search Pdf */}
                        <div className='flex items-center justify-center gap-2 p-2 sm:p-3 h-8 sm:h-9 self-stretch rounded-lg border border-[#E1E0E5] bg-white dark:bg-neutral-900 dark:border-neutral-700'>
                            <SearchIcon className="w-4 h-4 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search PDF files..."
                                className='flex-1 text-xs sm:text-sm text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-200 dark:placeholder:text-neutral-400 outline-0 bg-transparent'
                            />
                        </div>

                        {/* Folder List with Scroll */}
                        <div className='w-full max-h-48 sm:max-h-60 overflow-y-auto custom-scrollbar mb-6 sm:mb-8'>
                            {renderFolderList()}
                        </div>
                    </div>
                </div>

                {/* Form Footer */}
                <div className='flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0 self-stretch'>
                    <button className='flex justify-center items-center gap-1.5 sm:gap-2 py-2 sm:py-[13px] pr-3 sm:pr-4 pl-2 sm:pl-3 h-9 sm:h-8 rounded-lg border border-[#ECECEE] dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light dark:shadow-dark-panel text-xs sm:text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors'>
                        <UploadIcon className="w-4 h-4" />
                        Upload PDF file
                    </button>
                    <div className='flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto'>
                        <button
                            onClick={handleClose}
                            className='w-full sm:w-auto flex items-center justify-center gap-2 py-2 sm:py-[13px] px-4 sm:px-6 h-9 sm:h-8 rounded-lg border border-[#ECECEE] dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light dark:shadow-dark-panel text-xs sm:text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors'>
                            Cancel
                        </button>
                        <button
                            onClick={handleChooseFile}
                            disabled={!isChooseButtonEnabled}
                            className={`w-full sm:w-auto flex items-center justify-center gap-2 py-2 sm:py-[13px] px-4 sm:px-6 h-9 sm:h-8 rounded-lg border text-xs sm:text-sm font-medium shadow-light transition-all ${isChooseButtonEnabled
                                ? 'bg-primary-500 text-white dark:text-white hover:bg-primary-600 cursor-pointer border-primary-500'
                                : 'bg-stroke-100 text-neutral-100 dark:text-neutral-400 cursor-not-allowed border-[#ECECEE] dark:border-dark-border dark:bg-neutral-700'
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