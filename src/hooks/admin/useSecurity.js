'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/fetchWithAuth';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

/** Organization-wide security policies. */
export const useSecurity = () => {
  const [settings, setSettings] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      // api retries once after a 401, so an expired token no longer
      // silently drops the request.
      const res = await api.get('/api/admin/security');
      const data = await res.json();

      if (res.ok && data.success) {
        setSettings(data.security);
        setIsAdmin(Boolean(data.isAdmin));
      }
    } catch (err) {
      console.error('Failed to load security settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Optimistically apply the change, then persist it
  const updateSetting = useCallback(
    async (key, value) => {
      setSettings((prev) => ({ ...prev, [key]: value }));

      try {
        const res = await api.patch('/api/admin/security', { [key]: value });
        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.message || 'Failed to update');
        }

        // Surface how many existing links don't meet a newly enabled policy
        showSuccessToast(result.warning || 'Security settings updated');
      } catch (err) {
        showErrorToast(err.message || 'Failed to update settings');
        fetchSettings(); // Roll back to the server's state
      }
    },
    [fetchSettings]
  );

  return { settings, isAdmin, isLoading, updateSetting, refresh: fetchSettings };
};

export default useSecurity;