"use client";

import React, { useState, useEffect } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { CloseIcon } from '@/components/ui/icons';
import useModalStore from '@/store/ui/modalStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

const CopyFolderModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen, data } = modals.copyFolder || {};

    const [folderName, setFolderName] = useState('');
    const [targetFolder, setTargetFolder] = useState(null);
    const [folders, setFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingFolders, setIsFetchingFolders] = useState(false);

    // Load folders on mount
    useEffect(() => {
        if (isOpen) {
            fetchFolders();
            setFolderName(data?.name ? `Copy of ${data.name}` : '');
        }
    }, [isOpen, data]);

    const fetchFolders = async () => {
        setIsFetchingFolders(true);
        try {
            const response = await fetch('/api/folders', {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch folders');
            }

            const result = await response.json();
            // Filter out current folder and its children
            const availableFolders = result.folders.filter(
                folder => folder.id !== data?.id
            );
            setFolders(availableFolders);
        } catch (error) {
            showErrorToast('Failed to load folders');
        } finally {
            setIsFetchingFolders(false);
        }
    };

    const handleClose = () => {
        closeModal('copyFolder');
        setFolderName('');
        setTargetFolder(null);
    };

    const handleCopy = async () => {
        if (!folderName.trim()) {
            showErrorToast('Please enter a folder name');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/api/folders/${data.id}/copy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    newName: folderName.trim(),
                    targetFolderId: targetFolder,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to copy folder');
            }

            showSuccessToast('Folder copied successfully!');
            handleClose();

            // Refresh page to show new folder
            window.location.reload();
        } catch (error) {
            showErrorToast(error.message || 'Failed to copy folder');
        } finally {
            setIsLoading(false);
        }
    };

    if (!data) return null;

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='520px'>
            <div className="w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 19" fill="none">
                                <path d="M12 12.5V14.6C12 15.4401 12 15.8601 11.8365 16.181C11.6927 16.4632 11.4632 16.6927 11.181 16.8365C10.8601 17 10.4401 17 9.6 17H3.9C3.05992 17 2.63988 17 2.31901 16.8365C2.03677 16.6927 1.8073 16.4632 1.66349 16.181C1.5 15.8601 1.5 15.4401 1.5 14.6V8.9C1.5 8.05992 1.5 7.63988 1.66349 7.31901C1.8073 7.03677 2.03677 6.8073 2.31901 6.66349C2.63988 6.5 3.05992 6.5 3.9 6.5H6M8.4 12.5H14.1C14.9401 12.5 15.3601 12.5 15.681 12.3365C15.9632 12.1927 16.1927 11.9632 16.3365 11.681C16.5 11.3601 16.5 10.9401 16.5 10.1V4.4C16.5 3.55992 16.5 3.13988 16.3365 2.81901C16.1927 2.53677 15.9632 2.3073 15.681 2.16349C15.3601 2 14.9401 2 14.1 2H8.4C7.55992 2 7.13988 2 6.81901 2.16349C6.53677 2.3073 6.3073 2.53677 6.16349 2.81901C6 3.13988 6 3.55992 6 4.4V10.1C6 10.9401 6 11.3601 6.16349 11.681C6.3073 11.9632 6.53677 12.1927 6.81901 12.3365C7.13988 12.5 7.55992 12.5 8.4 12.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Copy Folder
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">
                                {data.name}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {/* Folder Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                            New Folder Name
                        </label>
                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="Enter folder name"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Target Folder Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                            Copy to Location (Optional)
                        </label>
                        <select
                            value={targetFolder || ''}
                            onChange={(e) => setTargetFolder(e.target.value || null)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            disabled={isLoading || isFetchingFolders}
                        >
                            <option value="">📍 Same location as original</option>
                            {folders.map((folder) => (
                                <option key={folder.id} value={folder.id}>
                                    📁 {folder.name}
                                </option>
                            ))}
                        </select>
                        {isFetchingFolders && (
                            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-2">
                                Loading folders...
                            </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-2">
                            Leave empty to create copy in the same location
                        </p>
                    </div>

                    {/* Info Message */}
                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
                            <path d="M10 13V10M10 7H10.0075M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                All files and subfolders will be copied to the new location. This may take a few moments.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-neutral-700">
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="px-6 py-2.5 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors font-medium disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCopy}
                        disabled={isLoading || !folderName.trim()}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Copying...
                            </div>
                        ) : (
                            'Copy Folder'
                        )}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default CopyFolderModal;