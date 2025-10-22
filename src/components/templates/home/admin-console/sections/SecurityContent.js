import React, { useState } from 'react';
import { SECURITY_SETTINGS, MONITORING_TABS } from '@/utils/constants/securityConstants';
import SecuritySettingItem from '@/components/modules/admin-console/security/SecuritySettingItem';
import MonitoringTabs from '@/components/modules/admin-console/security/MonitoringTabs';

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
        <main className="flex flex-1 flex-col items-start gap-6 py-6 px-8 self-stretch bg-white">
            {/* Security Settings Section */}
            <section className="flex flex-col justify-center items-start p-4 gap-4 self-stretch rounded-lg border border-stroke-200">
                <header className="w-full">
                    <h2 className="text-medium-16 mb-2">Security Settings</h2>
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
            <section className="flex flex-1 flex-col items-start gap-5 self-stretch w-full">
                <header>
                    <h2 className="text-medium-18">Monitoring</h2>
                </header>
                
                <MonitoringTabs
                    activeTab={activeMonitoringTab}
                    onTabChange={setActiveMonitoringTab}
                    tabs={MONITORING_TABS}
                />

                {/* Content based on active tab - Empty for now */}
                <div className="w-full">
                    {/* Activity Tab Content - To be filled from Figma */}
                    {activeMonitoringTab === 'activity' && (
                        <div className="w-full min-h-[200px] flex items-center justify-center text-regular-14-neutral-200">
                            {/* Content will be added from Figma */}
                        </div>
                    )}
                    
                    {activeMonitoringTab === 'external-sharing' && (
                        <div className="w-full min-h-[200px] flex items-center justify-center text-regular-14-neutral-200">
                            {/* Content will be added from Figma */}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default SecurityContent;