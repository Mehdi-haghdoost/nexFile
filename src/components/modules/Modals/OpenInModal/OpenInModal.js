"use client";

import React from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { CloseIcon } from '@/components/ui/icons';
import useModalStore from '@/store/ui/modalStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

const OpenInModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen, data } = modals.openIn || {};

    const handleClose = () => {
        closeModal('openIn');
    };

    const handleOpenNewTab = () => {
        if (data?.secureUrl || data?.url) {
            window.open(data.secureUrl || data.url, '_blank');
            showSuccessToast('File opened in new tab!');
            handleClose();
        } else {
            showErrorToast('File URL not available');
        }
    };

    const handleDownloadAndOpen = async () => {
        try {
            const link = document.createElement('a');
            link.href = data.secureUrl || data.url;
            link.download = data.originalName || data.name;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showSuccessToast('Download started!');
            handleClose();
        } catch (error) {
            showErrorToast('Failed to download file');
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(data.secureUrl || data.url);
            showSuccessToast('Link copied to clipboard!');
        } catch (error) {
            showErrorToast('Failed to copy link');
        }
    };

    if (!data) return null;

    const getFileIcon = () => {
        const ext = data.extension?.toLowerCase();
        
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
            return '🖼️';
        } else if (['pdf'].includes(ext)) {
            return '📄';
        } else if (['doc', 'docx'].includes(ext)) {
            return '📝';
        } else if (['xls', 'xlsx', 'csv'].includes(ext)) {
            return '📊';
        } else if (['zip', 'rar', '7z'].includes(ext)) {
            return '📦';
        } else if (['mp4', 'avi', 'mkv'].includes(ext)) {
            return '🎥';
        } else if (['mp3', 'wav', 'flac'].includes(ext)) {
            return '🎵';
        } else if (['js', 'py', 'java', 'html', 'css'].includes(ext)) {
            return '💻';
        }
        return '📄';
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='480px'>
            <div className="w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 shadow-lg text-2xl">
                            {getFileIcon()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Open File
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5 truncate max-w-[300px]">
                                {data?.originalName || data?.name}
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

                {/* Options */}
                <div className="space-y-3">
                    {/* Open in New Tab */}
                    <button
                        onClick={handleOpenNewTab}
                        className="w-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all group"
                    >
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-500/20 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Open in New Tab
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-neutral-400">
                                View file in browser
                            </p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400 group-hover:translate-x-1 transition-transform">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {/* Download & Open */}
                    <button
                        onClick={handleDownloadAndOpen}
                        className="w-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all group"
                    >
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-500/20 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Download & Open
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-neutral-400">
                                Download to your device
                            </p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400 group-hover:translate-x-1 transition-transform">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {/* Copy Link */}
                    <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all group"
                    >
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 dark:bg-green-500/20 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Copy Link
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-neutral-400">
                                Copy file URL to share
                            </p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400 group-hover:translate-x-1 transition-transform">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Cancel Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2.5 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default OpenInModal;