"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { usePublicTransfer } from '@/hooks/transfers/usePublicTransfer';
import PublicTransferFile from '@/components/templates/transfer/PublicTransferFile';
import PublicTransferGate from '@/components/templates/transfer/PublicTransferGate';
import { NexFileLogoIcon } from '@/components/ui/icons';
import { formatBytes, getDaysRemaining } from '@/utils/transfers/formatBytes';
import {
    TRANSFER_DOWNLOAD_ISSUE_MESSAGES,
    TRANSFER_DOWNLOAD_ISSUE_PARAM,
} from '@/utils/constants/transferConstants';

const PublicTransferPage = () => {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = params?.token;

    const {
        transfer,
        files,
        isLoading,
        isUnlocking,
        isUnlocked,
        isLockedOut,
        error,
        unlock,
    } = usePublicTransfer(token);

    const [password, setPassword] = useState('');
    const [downloadIssue, setDownloadIssue] = useState('');

    // Read once into state, then dropped from the URL so a reload does not repeat it
    useEffect(() => {
        const issue = searchParams.get(TRANSFER_DOWNLOAD_ISSUE_PARAM);
        if (!issue) return;

        setDownloadIssue(TRANSFER_DOWNLOAD_ISSUE_MESSAGES[issue] || '');
        router.replace(`/t/${token}`, { scroll: false });
    }, [searchParams, router, token]);

    const handleUnlock = async () => {
        if (!password.trim()) return;

        setDownloadIssue('');
        await unlock(password);
    };

    // Opens each file through the download route, which counts it and signs a fresh URL
    const handleDownloadAll = () => {
        files.forEach((file) => {
            if (file.downloadUrl) window.open(file.downloadUrl, '_blank', 'noopener,noreferrer');
        });
    };

    const daysRemaining = getDaysRemaining(transfer?.expirationDate);

    return (
        <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-neutral-900 px-4 py-10'>
            <div className='w-full max-w-md'>
                {/* Brand mark, since this page is seen by people with no account */}
                <div className='mb-6 flex items-center justify-center gap-2'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8]'>
                        <NexFileLogoIcon />
                    </div>
                    <span className='text-base font-medium text-neutral-500 dark:text-white'>NexFile</span>
                </div>

                <div className='rounded-xl border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 sm:p-6 shadow-light dark:shadow-dark-panel'>
                    {isLoading ? (
                        <div className='flex items-center justify-center py-16'>
                            <div className='h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent' />
                        </div>
                    ) : error && !transfer ? (
                        /* Expired, deleted, or a token that never existed */
                        <div className='flex flex-col items-center gap-3 py-12 text-center'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-stroke-100 dark:bg-neutral-700'>
                                <svg className='h-6 w-6 text-neutral-300' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z' />
                                </svg>
                            </div>
                            <h1 className='text-base font-medium text-neutral-500 dark:text-white'>
                                Transfer unavailable
                            </h1>
                            <p className='text-sm text-neutral-300 dark:text-neutral-400'>{error}</p>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-5'>
                            {/* Summary */}
                            <div className='flex flex-col gap-1'>
                                <h1 dir='auto' className='text-lg font-medium text-neutral-500 dark:text-white'>
                                    {transfer.groupName}
                                </h1>
                                <p className='text-xs text-neutral-300 dark:text-neutral-400'>
                                    {transfer.filesCount} {transfer.filesCount === 1 ? 'file' : 'files'} · {formatBytes(transfer.totalSize)} · expires in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                                </p>
                            </div>

                            {/* Explains a download that bounced back instead of starting */}
                            {downloadIssue && (
                                <p className='rounded-lg bg-error-400/10 px-3 py-2 text-xs text-error-400'>
                                    {downloadIssue}
                                </p>
                            )}

                            {!isUnlocked && (
                                <PublicTransferGate
                                    password={password}
                                    onPasswordChange={setPassword}
                                    onUnlock={handleUnlock}
                                    isUnlocking={isUnlocking}
                                    isLockedOut={isLockedOut}
                                    error={error}
                                />
                            )}

                            {/* File list */}
                            <div className='flex max-h-[320px] flex-col gap-2 overflow-y-auto custom-scrollbar'>
                                {files.map((file, index) => (
                                    <PublicTransferFile
                                        key={`${file.name}-${index}`}
                                        file={file}
                                        isUnlocked={isUnlocked}
                                    />
                                ))}
                            </div>

                            {/* Popup blockers can stop multiple tabs, so point to the per-file fallback */}
                            {isUnlocked && files.length > 1 && (
                                <div className='flex flex-col gap-1.5'>
                                    <button
                                        onClick={handleDownloadAll}
                                        className='flex h-10 items-center justify-center rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] px-6 text-sm font-medium text-white shadow-light transition-all duration-200 hover:shadow-md active:scale-95'
                                    >
                                        Download all
                                    </button>
                                    <p className='text-center text-xs text-neutral-300 dark:text-neutral-400'>
                                        If nothing happens, allow popups or download each file above
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicTransferPage;