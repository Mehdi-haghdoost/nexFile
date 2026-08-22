'use client';
import React, { useState, useEffect } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import useModalStore from '@/store/ui/modalStore';
import { SETTINGS_LANGUAGES, DEFAULT_LANGUAGE, MAX_TEAM_NAME_LENGTH } from '@/utils/constants/settingsConstants';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

const fieldClass =
    'w-full h-10 px-3 rounded-lg border border-stroke-300 bg-white text-sm text-neutral-500 focus:outline-none focus:border-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white';

const TeamOverviewModal = () => {
    const { isOpen, data } = useModalStore((state) => state.modals.teamOverview);
    const closeModal = useModalStore((state) => state.closeModal);

    const [name, setName] = useState('');
    const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Seed the form from the current settings each time the modal opens
    useEffect(() => {
        if (!isOpen) return;

        setName(data?.name || '');
        setLanguage(data?.language || DEFAULT_LANGUAGE);
        setIsSubmitting(false);
    }, [isOpen, data]);

    const handleClose = () => closeModal('teamOverview');

    const handleSubmit = async () => {
        const trimmed = name.trim();

        if (!trimmed) {
            showErrorToast('Team name is required');
            return;
        }

        setIsSubmitting(true);
        const result = await data?.onSubmit?.({ name: trimmed, language });
        setIsSubmitting(false);

        if (result?.success) {
            showSuccessToast('Team settings updated');
            handleClose();
        } else {
            showErrorToast(result?.message || 'Failed to update team settings');
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width="440px">
            <div className="flex w-full flex-col gap-4">
                <header className="flex flex-col gap-1">
                    <h2 className="text-base font-medium text-neutral-500 dark:text-white">Team overview</h2>
                    <p className="text-xs text-neutral-300 dark:text-neutral-200">
                        These details appear across the admin console and on shared content.
                    </p>
                </header>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="team-name" className="text-xs text-neutral-300 dark:text-neutral-200">
                            Team name
                        </label>
                        <input
                            id="team-name"
                            type="text"
                            className={fieldClass}
                            value={name}
                            maxLength={MAX_TEAM_NAME_LENGTH}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Acme Inc."
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="team-language" className="text-xs text-neutral-300 dark:text-neutral-200">
                            Language
                        </label>
                        <select
                            id="team-language"
                            className={`${fieldClass} cursor-pointer [&>option]:bg-white [&>option]:dark:bg-neutral-800`}
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            {SETTINGS_LANGUAGES.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <p className="text-xs text-neutral-300 dark:text-neutral-200">
                        Logo upload is coming soon.
                    </p>
                </div>

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
                        onClick={handleSubmit}
                        disabled={isSubmitting || !name.trim()}
                        className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default TeamOverviewModal;