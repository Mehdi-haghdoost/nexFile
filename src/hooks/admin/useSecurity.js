'use client';
import { useState, useEffect, useCallback } from 'react';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export const useSecurity = () => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/security', { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.security);
      }
    } catch (err) {
      console.log('Failed to load security settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Optimistically apply the change, then persist it
  const updateSetting = useCallback(async (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));

    try {
      const res = await fetch('/api/admin/security', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Failed to update');
      showSuccessToast('Security settings updated');
    } catch (err) {
      showErrorToast(err.message || 'Failed to update settings');
      fetchSettings(); // Roll back to the server's state
    }
  }, [fetchSettings]);

  return { settings, isLoading, updateSetting };
};

export default useSecurity;