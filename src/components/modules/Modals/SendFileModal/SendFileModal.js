'use client';
import React, { useState, useEffect } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import useModalStore from '@/store/ui/modalStore';
import useMonitorStore from '@/store/features/monitor/monitorStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { CloseIcon, FilesIcon, CopyLinkIcon } from '@/components/ui/icons';

const SendFileModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen } = modals.sendFile || {};
    const bumpRefresh = useMonitorStore((s) => s.bumpRefresh);

    const [files, setFiles] = useState([]);
    const [isLoadingFiles, setIsLoadingFiles] = useState(false);
    const [selectedFileId, setSelectedFileId] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');

    // Load the user's files to pick from, each time the modal opens
    useEffect(() => {
        if (!isOpen) return;

        setSelectedFileId(null);
        setGeneratedLink('');
        setIsLoadingFiles(true);

        const load = async () => {
            try {
                const res = await fetch('/api/files/suggested?limit=50', {
                    credentials: 'include',
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    setFiles(data.files || []);
                }
            } catch (error) {
                console.log('Failed to load files:', error);
                setFiles([]);
            } finally {
                setIsLoadingFiles(false);
            }
        };

        load();
    }, [isOpen]);

    const handleClose = () => {
        if (isSending) return;
        closeModal('sendFile');
    };

    const handleSend = async () => {
        if (!selectedFileId) {
            showErrorToast('Please select a file');
            return;
        }

        setIsSending(true);
        try {
            const res = await fetch('/api/files/monitor', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileId: selectedFileId }),
            });
            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(result.message || 'Failed to send file');
            }

            setGeneratedLink(`${window.location.origin}/view/${result.token}`);
            showSuccessToast('Tracked link created');
            bumpRefresh(); // Tell the monitor table to refetch
        } catch (error) {
            showErrorToast(error.message || 'Failed to send file');
        } finally {
            setIsSending(false);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(generatedLink);
            showSuccessToast('Link copied to clipboard!');
        } catch {
            showErrorToast('Failed to copy link');
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='520px'>
            <div className='w-full'>
                {/* Header */}
                <div className='flex items-center justify-between mb-4 sm:mb-5'>
                    <h2 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white'>
                        Send file
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={isSending}
                        className='p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50'
                        aria-label='Close'
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Demo notice */}
                <div className='mb-4 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-3 py-2'>
                    <p className='text-xs text-amber-700 dark:text-amber-400'>
                        Demo mode — sending seeds sample view activity so you can see the
                        monitoring table in action.
                    </p>
                </div>

                {generatedLink ? (
                    /* Result view: show the generated tracked link */
                    <div className='flex flex-col gap-3'>
                        <p className='text-sm text-neutral-500 dark:text-neutral-300'>
                            Your tracked link is ready. Anyone opening it will appear in the
                            monitoring table.
                        </p>
                        <div className='flex items-center gap-2 h-11 px-3 rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-800'>
                            <p className='flex-1 truncate text-sm text-neutral-500 dark:text-white'>
                                {generatedLink}
                            </p>
                            <button
                                onClick={handleCopyLink}
                                className='flex-shrink-0 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors'
                                aria-label='Copy link'
                            >
                                <CopyLinkIcon />
                            </button>
                        </div>
                        <button
                            onClick={handleClose}
                            className='mt-1 h-9 rounded-lg bg-gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity'
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    /* Picker view: choose which file to send */
                    <div className='flex flex-col gap-3'>
                        <p className='text-xs text-neutral-300 dark:text-neutral-300'>
                            Choose a file to send
                        </p>

                        <div className='max-h-[280px] overflow-y-auto custom-scrollbar rounded-lg border border-stroke-200 dark:border-neutral-700'>
                            {isLoadingFiles ? (
                                <div className='flex items-center justify-center py-10'>
                                    <div className='w-5 h-5 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin' />
                                </div>
                            ) : files.length === 0 ? (
                                <div className='py-10 text-center text-sm text-neutral-300 dark:text-neutral-400'>
                                    No files available to send
                                </div>
                            ) : (
                                <ul>
                                    {files.map((file) => (
                                        <li key={file.id}>
                                            <button
                                                onClick={() => setSelectedFileId(file.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors border-b border-stroke-100 dark:border-neutral-800 last:border-b-0
                                                    ${selectedFileId === file.id
                                                        ? 'bg-primary-50 dark:bg-primary-500/10'
                                                        : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
                                                    }`}
                                            >
                                                <span className='flex-shrink-0 w-5 h-5 flex items-center justify-center'>
                                                    <FilesIcon />
                                                </span>
                                                <span className='flex-1 min-w-0 text-sm text-neutral-500 dark:text-white truncate'>
                                                    {file.name}
                                                </span>
                                                {file.extension && (
                                                    <span className='flex-shrink-0 text-[10px] uppercase px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-300'>
                                                        {file.extension}
                                                    </span>
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Actions */}
                        <div className='flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-1'>
                            <button
                                onClick={handleClose}
                                disabled={isSending}
                                className='flex justify-center items-center h-9 px-4 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={isSending || !selectedFileId}
                                className='flex justify-center items-center gap-2 h-9 px-5 rounded-lg border border-[#5749BF] bg-gradient-primary text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50'
                            >
                                {isSending ? (
                                    <>
                                        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                        Sending...
                                    </>
                                ) : (
                                    'Send'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

export default SendFileModal;