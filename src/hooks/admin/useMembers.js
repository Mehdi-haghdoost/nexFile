'use client';
import { useState, useEffect, useCallback } from 'react';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export const useMembers = (activeTab) => {
  const [organization, setOrganization] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [isOrgLoading, setIsOrgLoading] = useState(true);

  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load the org context and the full switcher list once on mount
  useEffect(() => {
    const loadOrg = async () => {
      try {
        const res = await fetch('/api/admin/organization', { credentials: 'include' });
        const data = await res.json();
        if (res.ok && data.success) {
          setOrganization(data.organization);
          setOrganizations(data.organizations || []);
          setSelectedOrgId(data.organization.id);
        }
      } catch (err) {
        console.log('Failed to load organization:', err);
      } finally {
        setIsOrgLoading(false);
      }
    };
    loadOrg();
  }, []);

  // Switch which organization's members are being viewed
  const switchOrg = useCallback((orgId) => {
    setSelectedOrgId(orgId);
    const org = organizations.find((o) => o.id === orgId);
    if (org) setOrganization({ id: org.id, name: org.name });
  }, [organizations]);

  const fetchMembers = useCallback(async () => {
    if (!selectedOrgId) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/members?tab=${activeTab}&orgId=${selectedOrgId}`,
        { credentials: 'include' }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load members');
      }
      setMembers(data.members || []);
    } catch (err) {
      setError(err.message);
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, selectedOrgId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const updateMember = useCallback(async (id, updates) => {
    try {
      const res = await fetch(`/api/admin/members/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Failed to update member');
      showSuccessToast('Member updated');
      fetchMembers();
    } catch (err) {
      showErrorToast(err.message || 'Failed to update member');
    }
  }, [fetchMembers]);

  const removeMember = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/admin/members/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Failed to remove member');
      showSuccessToast('Member removed');
      fetchMembers();
    } catch (err) {
      showErrorToast(err.message || 'Failed to remove member');
    }
  }, [fetchMembers]);

  const cancelInvite = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/admin/invites/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Failed to cancel invite');
      showSuccessToast('Invite canceled');
      fetchMembers();
    } catch (err) {
      showErrorToast(err.message || 'Failed to cancel invite');
    }
  }, [fetchMembers]);

  return {
    organization,
    organizations,
    selectedOrgId,
    switchOrg,
    isOrgLoading,
    members,
    isLoading,
    error,
    refetch: fetchMembers,
    updateMember,
    removeMember,
    cancelInvite,
  };
};

export default useMembers;