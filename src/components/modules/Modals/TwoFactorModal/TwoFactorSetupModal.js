'use client';
import React, { useState, useEffect, useRef } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import useModalStore from '@/store/ui/modalStore';
import { TWO_FACTOR_STEPS } from '@/utils/constants/securityConstants';
import { copyTextToClipboard } from '@/utils/clipboard';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

const TwoFactorSetupModal = () => {
    const { isOpen, data } = useModalStore((state) => state.modals.twoFactorSetup);
    const closeModal = useModalStore((state) => state.closeModal);

    const [step, setStep] = useState(TWO_FACTOR_STEPS.SCAN);
    const [setupData, setSetupData] = useState(null);
    const [code, setCode] = useState('');
    const [backupCodes, setBackupCodes] = useState([]);
    const [isBusy, setIsBusy] = useState(false);

    // Guards against a second setup call, which would issue a new secret and
    // invalidate the QR code already on screen.
    const hasStartedRef = useRef(false);

    useEffect(() => {
        if (!isOpen) {
            hasStartedRef.current = false;
            setStep(TWO_FACTOR_STEPS.SCAN);
            setSetupData(null);
            setCode('');
            setBackupCodes([]);
            setIsBusy(false);
            return;
        }

        if (hasStartedRef.current) return;
        hasStartedRef.current = true;

        let cancelled = false;

        const start = async () => {
            setIsBusy(true);
            const result = await data?.onStart?.();
            if (cancelled) return;

            if (result?.success) {
                setSetupData(result.data);
            } else {
                showErrorToast(result?.message || 'Failed to start setup');
                closeModal('twoFactorSetup');
            }
            setIsBusy(false);
        };

        start();

        return () => {
            cancelled = true;
        };
    }, [isOpen, data, closeModal]);

    const handleClose = () => closeModal('twoFactorSetup');

    const handleVerify = async () => {
        setIsBusy(true);
        const result = await data?.onConfirm?.(code);
        setIsBusy(false);

        if (result?.success) {
            setBackupCodes(result.backupCodes || []);
            setStep(TWO_FACTOR_STEPS.BACKUP_CODES);
        } else {
            showErrorToast(result?.message || 'Incorrect code');
            setCode('');
        }
    };

    const handleCopyCodes = async () => {
        const copied = await copyTextToClipboard(backupCodes.join('\n'));
        if (copied) {
            showSuccessToast('Backup codes copied');
        } else {
            showErrorToast('Failed to copy codes');
        }
    };

    const handleDownloadCodes = () => {
        const blob = new Blob(
            [`nexFile backup codes\n\nEach code works once.\n\n${backupCodes.join('\n')}\n`],
            { type: 'text/plain' }
        );
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'nexfile-backup-codes.txt';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width="440px">
            <div className="flex w-full flex-col gap-4">
                {step === TWO_FACTOR_STEPS.SCAN && (
                    <>
                        <header className="flex flex-col gap-1">
                            <h2 className="text-base font-medium text-neutral-500 dark:text-white">
                                Scan the QR code
                            </h2>
                            <p className="text-xs text-neutral-300 dark:text-neutral-200">
                                Open an authenticator app such as Google Authenticator, Authy or 1Password and scan this code.
                            </p>
                        </header>

                        <div className="flex flex-col items-center gap-3">
                            {!setupData ? (
                                <div className="h-[240px] w-[240px] animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
                            ) : (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={setupData.qrCodeDataUrl}
                                    alt="Two-step verification QR code"
                                    className="rounded-lg bg-white p-2"
                                    width={240}
                                    height={240}
                                />
                            )}

                            {setupData?.manualKey && (
                                <div className="w-full rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800">
                                    <p className="text-xs text-neutral-300 dark:text-neutral-200">
                                        Can&apos;t scan? Enter this key manually:
                                    </p>
                                    <code className="mt-1 block break-all font-mono text-xs text-neutral-500 dark:text-white">
                                        {setupData.manualKey}
                                    </code>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="h-9 rounded-lg px-4 text-sm font-medium text-neutral-500 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(TWO_FACTOR_STEPS.VERIFY)}
                                disabled={!setupData || isBusy}
                                className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

                {step === TWO_FACTOR_STEPS.VERIFY && (
                    <>
                        <header className="flex flex-col gap-1">
                            <h2 className="text-base font-medium text-neutral-500 dark:text-white">
                                Enter the 6-digit code
                            </h2>
                            <p className="text-xs text-neutral-300 dark:text-neutral-200">
                                Type the current code shown in your authenticator app.
                            </p>
                        </header>

                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            className="w-full rounded-lg border border-stroke-300 bg-white py-3 text-center font-mono text-2xl tracking-[0.4em] text-neutral-500 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setStep(TWO_FACTOR_STEPS.SCAN)}
                                className="h-9 rounded-lg px-4 text-sm font-medium text-neutral-500 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleVerify}
                                disabled={code.length !== 6 || isBusy}
                                className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isBusy ? 'Verifying...' : 'Verify'}
                            </button>
                        </div>
                    </>
                )}

                {step === TWO_FACTOR_STEPS.BACKUP_CODES && (
                    <>
                        <header className="flex flex-col gap-1">
                            <h2 className="text-base font-medium text-neutral-500 dark:text-white">
                                Save your backup codes
                            </h2>
                            <p className="text-xs text-neutral-300 dark:text-neutral-200">
                                These are shown only once. Each code signs you in a single time if you lose access to your authenticator.
                            </p>
                        </header>

                        <div className="grid grid-cols-2 gap-2 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800">
                            {backupCodes.map((backupCode) => (
                                <code
                                    key={backupCode}
                                    className="text-center font-mono text-xs text-neutral-500 dark:text-white"
                                >
                                    {backupCode}
                                </code>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleCopyCodes}
                                className="h-9 flex-1 rounded-lg border border-stroke-300 text-sm font-medium text-neutral-500 hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                            >
                                Copy
                            </button>
                            <button
                                type="button"
                                onClick={handleDownloadCodes}
                                className="h-9 flex-1 rounded-lg border border-stroke-300 text-sm font-medium text-neutral-500 hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                            >
                                Download
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    showSuccessToast('Two-step verification enabled');
                                    handleClose();
                                }}
                                className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Done
                            </button>
                        </div>
                    </>
                )}
            </div>
        </BaseModal>
    );
};

export default TwoFactorSetupModal;