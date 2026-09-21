"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { usePublicTransfer } from '@/hooks/transfers/usePublicTransfer';
import PublicTransferFile from '@/components/templates/transfer/PublicTransferFile';
import { NexFileLogoIcon, PasswordIcon } from '@/components/ui/icons';
import { formatBytes, getDaysRemaining } from '@/utils/transfers/formatBytes';

const PublicTransferPage = () => {
    const params = useParams();
    const token = params?.token;

    const {
        transfer,
        files,
        isLoading,
        isUnlocking,
        isUnlocked,
        error,
        unlock,
    } = usePublicTransfer(token);

    const [password, setPassword] = useState('');

    const handleUnlock = async () => {
        if (!password.trim()) return;
        await unlock(password);
    };

    // Opens each file through the download route, which counts it
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

                            {/* Password gate */}
                            {!isUnlocked && (
                                <div className='flex flex-col gap-3 rounded-lg border border-stroke-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 p-4'>
                                    <div className='flex items-center gap-2'>
                                        <div className='flex h-6 w-6 items-center justify-center rounded bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8]'>
                                            <PasswordIcon />
                                        </div>
                                        <p className='text-sm font-medium text-neutral-500 dark:text-white'>
                                            This transfer is password protected
                                        </p>
                                    </div>

                                    <input
                                        type='password'
                                        value={password}
                                        placeholder='Enter password'
                                        onChange={(event) => setPassword(event.target.value)}
                                        onKeyDown={(event) => event.key === 'Enter' && handleUnlock()}
                                        className='w-full rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-500 dark:text-white outline-none focus:border-primary-500'
                                    />

                                    {error && (
                                        <p className='text-xs text-error-400'>{error}</p>
                                    )}

                                    <button
                                        onClick={handleUnlock}
                                        disabled={isUnlocking || !password.trim()}
                                        className='flex h-9 items-center justify-center gap-2 rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] px-4 text-sm font-medium text-white shadow-light transition-all duration-200 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        {isUnlocking && (
                                            <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                                        )}
                                        {isUnlocking ? 'Unlocking...' : 'Unlock'}
                                    </button>
                                </div>
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