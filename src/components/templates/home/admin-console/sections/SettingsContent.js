'use client';
import React from 'react';
import SettingsSection from '@/components/modules/admin-console/settings/SettingsSection';
import { SETTINGS_SECTIONS } from '@/utils/constants/settingsConstants';
import useSettings from '@/hooks/admin/useSettings';
import useModalStore from '@/store/ui/modalStore';

const SettingsContent = () => {
    const { settings, isAdmin, isLoading, error, toggleFeature, updateTeam } = useSettings();
    const openModal = useModalStore((state) => state.openModal);

    // Modals render globally, so handlers travel through modal data
    const handleOpen = (item) => {
        if (item.modalName !== 'teamOverview') return;

        openModal('teamOverview', {
            name: settings?.name || '',
            language: settings?.language,
            onSubmit: updateTeam,
        });
    };

    return (
        <main className="flex flex-1 flex-col items-start gap-4 md:gap-6 py-4 px-4 md:py-6 md:px-8 self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800 min-h-screen w-full">
            {isLoading && (
                <div className="flex items-center justify-center w-full py-12">
                    <div className="w-5 h-5 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin" />
                </div>
            )}

            {!isLoading && error && (
                <div className="w-full py-12 text-center text-xs sm:text-sm text-red-500">
                    {error}
                </div>
            )}

            {!isLoading && !error && (
                <>
                    {!isAdmin && (
                        <p className="text-xs text-neutral-300 dark:text-neutral-200">
                            Only organization admins can change these settings.
                        </p>
                    )}

                    {SETTINGS_SECTIONS.map((section) => (
                        <SettingsSection
                            key={section.id}
                            section={section}
                            features={settings?.features}
                            isAdmin={isAdmin}
                            onToggle={toggleFeature}
                            onOpen={handleOpen}
                        />
                    ))}
                </>
            )}
        </main>
    );
};

export default SettingsContent;