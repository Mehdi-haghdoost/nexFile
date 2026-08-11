'use client';
import React, { useState } from 'react';
import { SECURITY_SETTINGS_SCHEMA, MONITORING_TABS } from '@/utils/constants/securityConstants';
import SecuritySettingItem from '@/components/modules/admin-console/security/SecuritySettingItem';
import MonitoringTabs from '@/components/modules/admin-console/security/MonitoringTabs';
import ActivityContent from '@/components/templates/home/admin-console/security/ActivityContent';
import useSecurity from '@/hooks/admin/useSecurity';
import usePersonalSecurity from '@/hooks/auth/usePersonalSecurity';
import useModalStore from '@/store/ui/modalStore';

const SecurityContent = () => {
    const [activeMonitoringTab, setActiveMonitoringTab] = useState('activity');
    const openModal = useModalStore((state) => state.openModal);

    const { settings: orgSettings, isAdmin, isLoading: isOrgLoading, updateSetting } = useSecurity();
    const {
        security: personalSecurity,
        isLoading: isPersonalLoading,
        setPassword,
        startTwoFactorSetup,
        confirmTwoFactor,
        disableTwoFactor,
    } = usePersonalSecurity();

    const isLoading = isOrgLoading || isPersonalLoading;
    const hasPassword = Boolean(personalSecurity?.hasPassword);

    /** Personal values live on the user, org policies on the organization. */
    const getValue = (item) =>
        item.scope === 'personal' ? personalSecurity?.[item.id] : orgSettings?.[item.id];

    const buildHint = (item) => {
        if (item.id === 'password' && !hasPassword) {
            return 'No password set yet. Your account currently signs in with Google only.';
        }
        if (item.id === 'twoStepVerification') {
            if (!hasPassword) return 'Set an account password first.';
            if (personalSecurity?.twoStepVerification) {
                return `${personalSecurity.unusedBackupCodes} backup codes remaining.`;
            }
        }
        if (item.scope === 'organization' && !isAdmin) {
            return 'Only organization admins can change this.';
        }
        return null;
    };

    const isDisabled = (item) => {
        // Two-step verification needs a password to fall back on.
        if (item.id === 'twoStepVerification') return !hasPassword;
        if (item.scope === 'organization') return !isAdmin;
        return false;
    };

    // Merge the static schema with the values loaded from the server
    const securitySettings = SECURITY_SETTINGS_SCHEMA.map((item) => ({
        ...item,
        actionText: item.id === 'password' && hasPassword ? 'Change password' : item.actionText,
        status: item.type === 'switch' ? Boolean(getValue(item)) : null,
        currentOption: item.type === 'dropdown' ? getValue(item) || item.options?.[0] : undefined,
        disabled: isDisabled(item),
        hint: buildHint(item),
    }));

    const handleToggle = (id, value) => {
        // Modals are rendered globally, so handlers are passed through modal data
        // instead of each modal running its own copy of the security hook.
        if (id === 'twoStepVerification') {
            if (value) {
                openModal('twoFactorSetup', {
                    onStart: startTwoFactorSetup,
                    onConfirm: confirmTwoFactor,
                });
            } else {
                openModal('twoFactorDisable', { onConfirm: disableTwoFactor });
            }
            return;
        }
        updateSetting(id, value);
    };

    const handleChangeOption = (id, value) => {
        updateSetting(id, value);
    };

    const handleAction = (id) => {
        if (id === 'password') {
            openModal('setPassword', { hasPassword, onSubmit: setPassword });
        }
    };

    return (
        <main className="flex flex-1 flex-col items-start gap-4 md:gap-6 py-4 px-4 md:py-6 md:px-8 self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800 min-h-screen w-full">
            {/* Security settings */}
            <section className="flex flex-col justify-center items-start p-3 sm:p-4 gap-3 sm:gap-4 self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 w-full">
                <header className="w-full">
                    <h2 className="text-sm sm:text-base font-medium text-neutral-500 dark:text-white mb-2">Security Settings</h2>
                </header>

                {isLoading ? (
                    <div className="flex items-center justify-center w-full py-8">
                        <div className="w-5 h-5 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin" />
                    </div>
                ) : (
                    securitySettings.map((setting) => (
                        <SecuritySettingItem
                            key={setting.id}
                            setting={setting}
                            onToggle={handleToggle}
                            onChangeOption={handleChangeOption}
                            onAction={handleAction}
                        />
                    ))
                )}
            </section>

            {/* Monitoring */}
            <section className="flex flex-1 flex-col items-start gap-4 md:gap-5 self-stretch w-full">
                <header>
                    <h2 className="text-base sm:text-lg font-medium text-neutral-500 dark:text-white">Monitoring</h2>
                </header>

                <MonitoringTabs
                    activeTab={activeMonitoringTab}
                    onTabChange={setActiveMonitoringTab}
                    tabs={MONITORING_TABS}
                />

                <div className="w-full">
                    {activeMonitoringTab === 'activity' && <ActivityContent />}

                    {activeMonitoringTab === 'external-sharing' && (
                        <div className="w-full min-h-[200px] flex items-center justify-center text-xs sm:text-sm text-neutral-300 dark:text-neutral-200">
                            External sharing monitoring is not available yet
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default SecurityContent;