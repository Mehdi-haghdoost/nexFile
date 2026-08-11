'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/fetchWithAuth';
import { showErrorToast } from '@/lib/toast';

/** Password and two-step verification for the signed-in user. */
export const usePersonalSecurity = () => {
  const [security, setSecurity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSecurity = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/auth/security-status');
      const data = await res.json();

      if (res.ok && data.success) {
        setSecurity(data.security);
      }
    } catch (err) {
      console.error('Failed to load personal security status:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSecurity();
  }, [fetchSecurity]);

  /**
   * Changing the password revokes sessions elsewhere, so the current session
   * refreshes immediately to stay signed in.
   */
  const setPassword = useCallback(
    async ({ currentPassword, newPassword, confirmPassword }) => {
      try {
        const res = await api.post('/api/auth/set-password', {
          currentPassword,
          newPassword,
          confirmPassword,
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to update password');
        }

        await fetchSecurity();
        return { success: true, message: data.message };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },
    [fetchSecurity]
  );

  const startTwoFactorSetup = useCallback(async () => {
    try {
      const res = await api.post('/api/auth/two-factor/setup', {});
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to start setup');
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const confirmTwoFactor = useCallback(
    async (code) => {
      try {
        const res = await api.post('/api/auth/two-factor/enable', { code });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to enable');
        }

        await fetchSecurity();
        return { success: true, backupCodes: data.backupCodes };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },
    [fetchSecurity]
  );

  const disableTwoFactor = useCallback(
    async (password) => {
      try {
        const res = await api.post('/api/auth/two-factor/disable', { password });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to disable');
        }

        await fetchSecurity();
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },
    [fetchSecurity]
  );

  const regenerateBackupCodes = useCallback(async (password) => {
    try {
      const res = await api.post('/api/auth/two-factor/backup-codes', { password });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to regenerate codes');
      }

      return { success: true, backupCodes: data.backupCodes };
    } catch (err) {
      showErrorToast(err.message);
      return { success: false, message: err.message };
    }
  }, []);

  return {
    security,
    isLoading,
    setPassword,
    startTwoFactorSetup,
    confirmTwoFactor,
    disableTwoFactor,
    regenerateBackupCodes,
    refresh: fetchSecurity,
  };
};

export default usePersonalSecurity;