import React, { useState } from 'react';
import { SECURITY_SETTINGS, MONITORING_TABS } from '@/utils/constants/securityConstants';
import SecuritySettingItem from '@/components/modules/admin-console/security/SecuritySettingItem';
import MonitoringTabs from '@/components/modules/admin-console/security/MonitoringTabs';
import ActivityContent from '@/components/templates/home/admin-console/security/ActivityContent';

const SecurityContent = () => {
    const [activeMonitoringTab, setActiveMonitoringTab] = useState('activity');
    const [securitySettings, setSecuritySettings] = useState(SECURITY_SETTINGS);

    const handleToggleSetting = (settingId, newValue) => {
        setSecuritySettings(prev =>
            prev.map(setting =>
                setting.id === settingId
                    ? { ...setting, status: newValue }
                    : setting
            )
        );
    };

    const handleChangeOption = (settingId, newOption) => {
        setSecuritySettings(prev =>
            prev.map(setting =>
                setting.id === settingId
                    ? { ...setting, currentOption: newOption }
                    : setting
            )
        );
    };

    return (
        <main className="flex flex-1 flex-col items-start gap-4 md:gap-6 py-4 px-4 md:py-6 md:px-8 self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800 min-h-screen w-full">
            {/* Security Settings Section */}
            <section className="flex flex-col justify-center items-start p-3 sm:p-4 gap-3 sm:gap-4 self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 w-full">
                <header className="w-full">
                    <h2 className="text-sm sm:text-base font-medium text-neutral-500 dark:text-white mb-2">Security Settings</h2>
                </header>

                {securitySettings.map((setting) => (
                    <SecuritySettingItem
                        key={setting.id}
                        setting={setting}
                        onToggle={handleToggleSetting}
                        onChangeOption={handleChangeOption}
                    />
                ))}
            </section>

            {/* Monitoring Section */}
            <section className="flex flex-1 flex-col items-start gap-4 md:gap-5 self-stretch w-full">
                <header>
                    <h2 className="text-base sm:text-lg font-medium text-neutral-500 dark:text-white">Monitoring</h2>
                </header>

                <MonitoringTabs
                    activeTab={activeMonitoringTab}
                    onTabChange={setActiveMonitoringTab}
                    tabs={MONITORING_TABS}
                />

                {/* Content based on active tab */}
                <div className="w-full">
                    {activeMonitoringTab === 'activity' && <ActivityContent />}
                    
                    {activeMonitoringTab === 'external-sharing' && (
                        <div className="w-full min-h-[200px] flex items-center justify-center text-xs sm:text-sm text-neutral-300 dark:text-neutral-200">
                            External sharing content will be added from Figma
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default SecurityContent;