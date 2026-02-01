"use client";

import React, { useState, useEffect } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { CloseIcon } from '@/components/ui/icons';
import useModalStore from '@/store/ui/modalStore';
import useFilesStore from '@/store/features/files/filesStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

const RenameModal = () => {
    const { modals, closeModal } = useModalStore();
    const { updateFile } = useFilesStore();
    const { isOpen, data } = modals.renameFile || {};

    const [fileName, setFileName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Initialize filename when modal opens
    useEffect(() => {
        if (isOpen && data?.fileName) {
            // Remove extension for editing
            const nameWithoutExt = data.fileName.replace(/\.[^/.]+$/, '');
            setFileName(nameWithoutExt);
            setError('');
        }
    }, [isOpen, data]);

    const handleClose = () => {
        setFileName('');
        setError('');
        closeModal('renameFile');
    };

    const validateFileName = (name) => {
        if (!name || name.trim() === '') {
            return 'File name cannot be empty';
        }
        
        // Check for invalid characters (Windows + Unix forbidden chars)
        // Note: We allow forward slash (/) for folder paths
        const invalidChars = /[<>:"|?*\\]/;
        if (invalidChars.test(name)) {
            return 'File name contains invalid characters: < > : " | ? * \\';
        }
        
        if (name.length > 255) {
            return 'File name is too long (max 255 characters)';
        }
        
        return null;
    };

    const handleRename = async (e) => {
        e.preventDefault();
        
        const validationError = validateFileName(fileName);
        if (validationError) {
            setError(validationError);
            return;
        }

        // Get file extension from original name
        const extension = data.fileName.match(/\.[^/.]+$/)?.[0] || '';
        const newFileName = fileName.trim() + extension;

        // Check if name actually changed
        if (newFileName === data.fileName) {
            handleClose();
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/files/${data.fileId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    originalName: newFileName 
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to rename file');
            }

            // Update file in store
            updateFile(data.fileId, { originalName: newFileName });
            
            showSuccessToast('File renamed successfully!');
            handleClose();
        } catch (error) {
            console.error('Rename error:', error);
            setError(error.message);
            showErrorToast(error.message || 'Failed to rename file');
        } finally {
            setIsLoading(false);
        }
    };

    const getFileExtension = () => {
        if (!data?.fileName) return '';
        const ext = data.fileName.match(/\.[^/.]+$/)?.[0];
        return ext ? ext.substring(1).toUpperCase() : '';
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='480px'>
            <div className="w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 19" fill="none">
                                <path d="M9.75 5.75012H3.9C3.05992 5.75012 2.63988 5.75012 2.31901 5.91361C2.03677 6.05742 1.8073 6.28689 1.66349 6.56914C1.5 6.89 1.5 7.31004 1.5 8.15012V10.8501C1.5 11.6902 1.5 12.1102 1.66349 12.4311C1.8073 12.7134 2.03677 12.9428 2.31901 13.0866C2.63988 13.2501 3.05992 13.2501 3.9 13.2501H9.75M12.75 5.75012H14.1C14.9401 5.75012 15.3601 5.75012 15.681 5.91361C15.9632 6.05742 16.1927 6.28689 16.3365 6.56914C16.5 6.89 16.5 7.31004 16.5 8.15012V10.8501C16.5 11.6902 16.5 12.1102 16.3365 12.4311C16.1927 12.7134 15.9632 12.9428 15.681 13.0866C15.3601 13.2501 14.9401 13.2501 14.1 13.2501H12.75M12.75 16.2501L12.75 2.75012M14.625 2.75013L10.875 2.75012M14.625 16.2501L10.875 16.2501" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Rename File
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors disabled:opacity-50"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleRename} className="space-y-4">
                    {/* Current Name Display */}
                    <div className="p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-neutral-400 mb-1">
                            Current name:
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {data?.fileName}
                        </p>
                    </div>

                    {/* New Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                            New name
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={fileName}
                                onChange={(e) => {
                                    setFileName(e.target.value);
                                    setError('');
                                }}
                                disabled={isLoading}
                                className={`w-full px-4 py-3 pr-16 border rounded-lg outline-none transition-all
                                    ${error 
                                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-500/20' 
                                        : 'border-gray-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-500/20'
                                    }
                                    bg-white dark:bg-neutral-800 
                                    text-gray-900 dark:text-white
                                    placeholder:text-gray-400 dark:placeholder:text-neutral-500
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                `}
                                placeholder="Enter new file name..."
                                autoFocus
                            />
                            {getFileExtension() && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-100 dark:bg-neutral-700 rounded text-xs font-medium text-gray-600 dark:text-neutral-300">
                                    .{getFileExtension()}
                                </div>
                            )}
                        </div>
                        {error && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 5.33333V8M8 10.6667H8.00667M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Helper Text */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                        <p className="text-xs text-blue-700 dark:text-blue-400 flex items-start gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
                                <path d="M8 5.33333V8M8 10.6667H8.00667M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>
                                The file extension will be preserved automatically. 
                                Avoid using these characters: {'<>:"|?*\\'}
                            </span>
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !fileName.trim() || !!error}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:from-primary-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-primary-500/30"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Renaming...
                                </span>
                            ) : (
                                'Rename'
                            )}
                        </button>
                    </div>
                </form> 
            </div>
        </BaseModal>
    );
};

export default RenameModal;