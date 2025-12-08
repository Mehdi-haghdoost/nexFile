import React from 'react';
import SettingsSection from '@/components/modules/admin-console/settings/SettingsSection';
import { SETTINGS_SECTIONS } from '@/utils/constants/settingsConstants';

const SettingsContent = () => {
    return (
        <main className="flex flex-1 flex-col items-start gap-4 md:gap-6 py-4 px-4 md:py-6 md:px-8 self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800 min-h-screen w-full">
            {SETTINGS_SECTIONS.map((section) => (
                <SettingsSection 
                    key={section.id} 
                    section={section} 
                />
            ))}
        </main>
    );
};

export default SettingsContent;