'use client';
import { useEffect, useCallback } from 'react';
import useSettingsStore from '@/store/features/settings/settingsStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

/** Team settings, product feature flags and organization policies. */
export const useSettings = () => {
  const settings = useSettingsStore((state) => state.settings);
  const isAdmin = useSettingsStore((state) => state.isAdmin);
  const isLoading = useSettingsStore((state) => state.isLoading);
  const error = useSettingsStore((state) => state.error);
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  /** @param {'features'|'policies'} group */
  const toggleSetting = useCallback(
    async (group, key, value) => {
      const result = await updateSettings({ [group]: { [key]: value } });

      if (result.success) {
        showSuccessToast('Settings updated');
      } else {
        showErrorToast(result.message || 'Failed to update settings');
      }

      return result;
    },
    [updateSettings]
  );

  const updateTeam = useCallback(
    async ({ name, language }) => updateSettings({ name, language }),
    [updateSettings]
  );

  return {
    settings,
    isAdmin,
    isLoading,
    error,
    toggleSetting,
    updateTeam,
    refresh: () => fetchSettings({ force: true }),
  };
};

export default useSettings;