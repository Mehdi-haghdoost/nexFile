"use client";

import React, { useState, useEffect } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { CloseIcon } from '@/components/ui/icons';
import useModalStore from '@/store/ui/modalStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

const CopyFileModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen, data } = modals.copyFile || {};

    const [fileName, setFileName] = useState('');
    const [targetFolder, setTargetFolder] = useState(null);
    const [folders, setFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingFolders, setIsFetchingFolders] = useState(false);

    // Load folders on mount
    useEffect(() => {
        if (isOpen) {
            fetchFolders();
            const originalName = data?.originalName || data?.name || '';
            setFileName(`Copy of ${originalName}`);
            setTargetFolder(data?.folder || null); // Default: same folder
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
            setFolders(result.folders || []);
        } catch (error) {
            showErrorToast('Failed to load folders');
        } finally {
            setIsFetchingFolders(false);
        }
    };

    const handleClose = () => {
        closeModal('copyFile');
        setFileName('');
        setTargetFolder(null);
    };

    const handleCopy = async () => {
        if (!fileName.trim()) {
            showErrorToast('Please enter a file name');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/api/files/${data.id}/copy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    newName: fileName.trim(),
                    targetFolderId: targetFolder,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to copy file');
            }

            showSuccessToast('File copied successfully!');
            handleClose();
            
            // Refresh page to show new file
            window.location.reload();
        } catch (error) {
            showErrorToast(error.message || 'Failed to copy file');
        } finally {
            setIsLoading(false);
        }
    };

    if (!data) return null;

    const currentFolderName = folders.find(f => f.id === data.folder)?.name || 'Root';

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='520px'>
            <div className="w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="none">
                                <path d="M11.6667 1.66675H5.00004C4.55801 1.66675 4.13409 1.84234 3.82153 2.1549C3.50897 2.46746 3.33337 2.89139 3.33337 3.33341V16.6667C3.33337 17.1088 3.50897 17.5327 3.82153 17.8453C4.13409 18.1578 4.55801 18.3334 5.00004 18.3334H15C15.4421 18.3334 15.866 18.1578 16.1786 17.8453C16.4911 17.5327 16.6667 17.1088 16.6667 16.6667V6.66675L11.6667 1.66675Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M11.6667 1.66675V6.66675H16.6667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Copy File
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">
                                {data?.displayName || data?.originalName || data?.name}
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
                    {/* File Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                            New File Name
                        </label>
                        <input
                            type="text"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            placeholder="Enter file name"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Target Folder Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                            Copy to Location
                        </label>
                        <select
                            value={targetFolder || ''}
                            onChange={(e) => setTargetFolder(e.target.value || null)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            disabled={isLoading || isFetchingFolders}
                        >
                            <option value="">📍 Root (My Files)</option>
                            {folders.map((folder) => (
                                <option key={folder.id} value={folder.id}>
                                    📁 {folder.name} {folder.id === data?.folder ? '(Current)' : ''}
                                </option>
                            ))}
                        </select>
                        {isFetchingFolders && (
                            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-2">
                                Loading folders...
                            </p>
                        )}
                    </div>

                    {/* Info Message */}
                    <div className="flex items-start gap-2 p-3 bg-purple-50 dark:bg-purple-500/10 rounded-lg border border-purple-200 dark:border-purple-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
                            <path d="M10 13V10M10 7H10.0075M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-xs text-purple-700 dark:text-purple-300">
                                The file will be duplicated in the selected location.
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
                        disabled={isLoading || !fileName.trim()}
                        className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Copying...
                            </div>
                        ) : (
                            'Copy File'
                        )}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default CopyFileModal;