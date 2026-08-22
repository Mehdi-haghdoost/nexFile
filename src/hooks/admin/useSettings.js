'use client';
import { useEffect, useCallback } from 'react';
import useSettingsStore from '@/store/features/settings/settingsStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

/** Team settings and product feature flags for the current organization. */
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

  const toggleFeature = useCallback(
    async (featureKey, value) => {
      const result = await updateSettings({ features: { [featureKey]: value } });

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
    toggleFeature,
    updateTeam,
    refresh: () => fetchSettings({ force: true }),
  };
};

export default useSettings;