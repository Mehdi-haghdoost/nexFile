"use client";
import React, { useState } from 'react'
import BaseModal from '@/components/layouts/Modal/BaseModal'
import useModalStore from '@/store/ui/modalStore';
import { CloseIcon } from '@/components/ui/icons';
import FolderItem from './FolderItem';
import { useFolders } from '@/hooks/files/createFileModal/useFolders';

const CreateFileModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen, data } = modals.createFile;
    const { folders, isLoading, error, isCreatingFile, refreshFolders, createFileInFolder } = useFolders();
    const [selectedFolder, setSelectedFolder] = useState(null);

    const handleClose = () => {
        closeModal('createFile');
        setSelectedFolder(null);
    };

    const handleFolderSelect = (folder) => {
        setSelectedFolder(folder);
    };

    const handleCancel = () => {
        handleClose();
    };

    const handleChooseFile = async () => {
        const result = await createFileInFolder(selectedFolder);

        if (result.success) {
            alert(result.message);
            handleClose();
        } else {
            alert(result.message);
        }
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
            <ul className='flex flex-col items-start self-stretch p-1'>
                {folders.map((folder) => (
                    <FolderItem
                        key={folder.id}
                        folder={folder}
                        isSelected={selectedFolder?.id === folder.id}
                        onSelect={handleFolderSelect}
                    />
                ))}
            </ul>
        );
    };

    const getCurrentPath = () => {
        return selectedFolder ? selectedFolder.path : 'Ridwan T./Campaign Design';
    };

    const isSubmitDisabled = () => {
        return isCreatingFile || !selectedFolder || isLoading || error;
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='520px'>
            {/* Form Section */}
            <div className="w-full">
                <div className='flex flex-col items-start gap-6 self-stretch'>
                    {/* Form Header */}
                    <div className='flex justify-between items-center self-stretch'>
                        <h3 className='text-medium-18 dark:text-medium-18-white'>Create file</h3>
                        <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded">
                            <CloseIcon />
                        </button>
                    </div>
                    {/* Text Fields Container */}
                    <div className='flex flex-col items-start gap-4 self-stretch'>
                        <div className='flex justify-between items-center self-stretch'>
                            <p className='text-medium-12'>
                                <span className='text-regular-12 dark:text-regular-12-neutral-300 pr-1'>{getCurrentPath().split('/')[0]}/</span>
                                <span className='text-regular-12 dark:text-regular-12-white'>{getCurrentPath().split('/').slice(1).join('/')}</span>
                            </p>
                            <p className='text-medium-12-primary'>Create new folder</p>
                        </div>
                        {/* Folder List Container */}
                        {renderFolderList()}
                    </div>
                </div>
                {/* Form Actions */}
                <div className='flex items-center justify-end gap-3 self-stretch mt-10'>
                    <button
                        onClick={handleCancel}
                        disabled={isCreatingFile}
                        className='flex items-center justify-center gap-2 h-8 py-[13px] px-6 rounded-lg border border-[#ECECEE] bg-white shadow-light text-medium-14 dark:text-medium-14-white text-center disabled:opacity-50 dark:border-dark-border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-dark-gradient dark:shadow-dark-panel'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleChooseFile}
                        disabled={isSubmitDisabled()}
                        className='flex items-center justify-center gap-2 h-8 py-[13px] px-6 rounded-lg border border-[#5749BF] shadow-middle bg-gradient-primary text-medium-14-white disabled:opacity-50'
                    >
                        {isCreatingFile ? 'Creating...' : 'Choose file'}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}

export default CreateFileModal