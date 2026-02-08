"use client";

import React, { useState, useEffect } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { CloseIcon } from '@/components/ui/icons';
import useModalStore from '@/store/ui/modalStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

const MoveModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen, data } = modals.move || {};

    const [targetFolder, setTargetFolder] = useState(null);
    const [folders, setFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingFolders, setIsFetchingFolders] = useState(false);

    const isFolder = data && !data.mimeType;

    // Load folders on mount
    useEffect(() => {
        if (isOpen) {
            fetchFolders();
            setTargetFolder(null); // Reset selection
        }
    }, [isOpen]);

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
            
            // Filter out current item if it's a folder
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
        closeModal('move');
        setTargetFolder(null);
    };

    const handleMove = async () => {
        setIsLoading(true);

        try {
            const endpoint = isFolder 
                ? `/api/folders/${data.id}/move`
                : `/api/files/${data.id}/move`;

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    targetFolderId: targetFolder,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to move item');
            }

            showSuccessToast(`${isFolder ? 'Folder' : 'File'} moved successfully!`);
            handleClose();
            
            // Refresh page to show changes
            window.location.reload();
        } catch (error) {
            showErrorToast(error.message || 'Failed to move item');
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
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M5 9L2 12M2 12L5 15M2 12H22M9 5L12 2M12 2L15 5M12 2V22M15 19L12 22M12 22L9 19M19 9L22 12M22 12L19 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Move {isFolder ? 'Folder' : 'File'}
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
                    {/* Current Location */}
                    <div className="p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
                        <p className="text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">
                            Current Location
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            📁 {currentFolderName}
                        </p>
                    </div>

                    {/* Target Folder Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                            Move to
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
                                    📁 {folder.name}
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
                    <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-500/10 rounded-lg border border-green-200 dark:border-green-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
                            <path d="M10 13V10M10 7H10.0075M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-xs text-green-700 dark:text-green-300">
                                The {isFolder ? 'folder' : 'file'} will be removed from its current location and moved to the selected destination.
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
                        onClick={handleMove}
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Moving...
                            </div>
                        ) : (
                            `Move ${isFolder ? 'Folder' : 'File'}`
                        )}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default MoveModal;