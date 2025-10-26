import React from 'react';
import SettingsSection from '@/components/modules/admin-console/settings/SettingsSection';
import { SETTINGS_SECTIONS } from '@/utils/constants/settingsConstants';

const SettingsContent = () => {
    return (
        <main className="flex flex-1 flex-col items-start gap-6 py-6 px-8 self-stretch bg-white">
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