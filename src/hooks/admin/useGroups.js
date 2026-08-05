'use client';
import { useState, useEffect, useCallback } from 'react';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export const useGroups = () => {
  const [organization, setOrganization] = useState(null);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Resolve the org context first, then load its groups
  useEffect(() => {
    const loadOrg = async () => {
      try {
        const res = await fetch('/api/admin/organization', { credentials: 'include' });
        const data = await res.json();
        if (res.ok && data.success) {
          setOrganization(data.organization);
        }
      } catch (err) {
        console.log('Failed to load organization:', err);
      }
    };
    loadOrg();
  }, []);

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/groups', { credentials: 'include' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load groups');
      }
      setGroups(data.groups || []);
    } catch (err) {
      setError(err.message);
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const updateGroup = useCallback(async (id, updates) => {
    try {
      const res = await fetch(`/api/admin/groups/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Failed to update group');
      showSuccessToast('Group updated');
      fetchGroups();
    } catch (err) {
      showErrorToast(err.message || 'Failed to update group');
    }
  }, [fetchGroups]);

  const deleteGroup = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/admin/groups/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Failed to delete group');
      showSuccessToast('Group deleted');
      fetchGroups();
    } catch (err) {
      showErrorToast(err.message || 'Failed to delete group');
    }
  }, [fetchGroups]);

  return {
    organization,
    groups,
    isLoading,
    error,
    refetch: fetchGroups,
    updateGroup,
    deleteGroup,
  };
};

export default useGroups;