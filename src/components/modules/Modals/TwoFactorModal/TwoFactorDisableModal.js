'use client';
import React, { useState, useEffect } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import useModalStore from '@/store/ui/modalStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

const TwoFactorDisableModal = () => {
    const { isOpen, data } = useModalStore((state) => state.modals.twoFactorDisable);
    const closeModal = useModalStore((state) => state.closeModal);

    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setPassword('');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleClose = () => closeModal('twoFactorDisable');

    const handleConfirm = async () => {
        setIsSubmitting(true);
        const result = await data?.onConfirm?.(password);
        setIsSubmitting(false);

        if (result?.success) {
            showSuccessToast('Two-step verification disabled');
            handleClose();
        } else {
            showErrorToast(result?.message || 'Failed to disable');
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width="440px">
            <div className="flex w-full flex-col gap-4">
                <header className="flex flex-col gap-1">
                    <h2 className="text-base font-medium text-neutral-500 dark:text-white">
                        Turn off two-step verification
                    </h2>
                    <p className="text-xs text-neutral-300 dark:text-neutral-200">
                        Your account will be protected by your password alone. Existing backup codes will be deleted.
                    </p>
                </header>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="current-password"
                    className="h-10 w-full rounded-lg border border-stroke-300 bg-white px-3 text-sm text-neutral-500 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="h-9 rounded-lg px-4 text-sm font-medium text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 dark:text-white dark:hover:bg-neutral-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!password || isSubmitting}
                        className="h-9 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Turning off...' : 'Turn off'}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default TwoFactorDisableModal;