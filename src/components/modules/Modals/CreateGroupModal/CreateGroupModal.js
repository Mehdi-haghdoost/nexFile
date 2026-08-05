'use client';
import React, { useState, useEffect } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import useModalStore from '@/store/ui/modalStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { CloseIcon, DesignerIcon } from '@/components/ui/icons';
import { GROUP_PERMISSIONS, GROUP_GRADIENTS } from '@/utils/constants/groupsConstants';

const CreateGroupModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen, data } = modals.createGroup || {};

    const [name, setName] = useState('');
    const [gradient, setGradient] = useState(GROUP_GRADIENTS[2].value);
    const [permission, setPermission] = useState(GROUP_PERMISSIONS.VIEW_ONLY);
    const [managerId, setManagerId] = useState('');
    const [selectedMemberIds, setSelectedMemberIds] = useState([]);

    const [orgMembers, setOrgMembers] = useState([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Load the org's active members to pick a manager and members from
    useEffect(() => {
        if (!isOpen) return;

        setName('');
        setGradient(GROUP_GRADIENTS[2].value);
        setPermission(GROUP_PERMISSIONS.VIEW_ONLY);
        setManagerId('');
        setSelectedMemberIds([]);
        setIsLoadingMembers(true);

        const load = async () => {
            try {
                const res = await fetch('/api/admin/members?tab=active', { credentials: 'include' });
                const result = await res.json();
                if (res.ok && result.success) {
                    setOrgMembers(result.members || []);
                }
            } catch (error) {
                console.log('Failed to load members:', error);
                setOrgMembers([]);
            } finally {
                setIsLoadingMembers(false);
            }
        };

        load();
    }, [isOpen]);

    const handleClose = () => {
        if (isCreating) return;
        closeModal('createGroup');
    };

    const toggleMember = (id) => {
        setSelectedMemberIds((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        );
    };

    const handleCreate = async () => {
        if (!name.trim()) {
            showErrorToast('Please enter a group name');
            return;
        }

        setIsCreating(true);
        try {
            const res = await fetch('/api/admin/groups', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    gradient,
                    permission,
                    managerId: managerId || null,
                    memberIds: selectedMemberIds,
                }),
            });
            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(result.message || 'Failed to create group');
            }

            showSuccessToast('Group created');
            data?.onCreated?.();
            closeModal('createGroup');
        } catch (error) {
            showErrorToast(error.message || 'Failed to create group');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='480px'>
            <div className='w-full'>
                {/* Header */}
                <div className='flex items-center justify-between mb-4 sm:mb-5'>
                    <h2 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white'>
                        Create new group
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={isCreating}
                        className='p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50'
                        aria-label='Close'
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className='flex flex-col gap-4'>
                    {/* Name */}
                    <div>
                        <label className='block text-xs text-neutral-500 dark:text-neutral-300 mb-1.5'>
                            Group name
                        </label>
                        <input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='e.g. UI/UX Designer'
                            disabled={isCreating}
                            className='w-full h-10 px-3 rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm text-neutral-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50'
                        />
                    </div>

                    {/* Color picker */}
                    <div>
                        <label className='block text-xs text-neutral-500 dark:text-neutral-300 mb-1.5'>
                            Color
                        </label>
                        <div className='flex items-center gap-2'>
                            {GROUP_GRADIENTS.map((g) => (
                                <button
                                    key={g.id}
                                    type='button'
                                    onClick={() => setGradient(g.value)}
                                    aria-label={`Select ${g.id} color`}
                                    className={`flex justify-center items-center p-1 h-8 w-8 rounded bg-gradient-to-b ${g.value} transition-all
                                        ${gradient === g.value
                                            ? 'ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-neutral-900'
                                            : 'hover:scale-105'
                                        }`}
                                >
                                    <DesignerIcon />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Permission */}
                    <div>
                        <label className='block text-xs text-neutral-500 dark:text-neutral-300 mb-1.5'>
                            Content permission
                        </label>
                        <select
                            value={permission}
                            onChange={(e) => setPermission(e.target.value)}
                            disabled={isCreating}
                            className='w-full h-10 px-3 rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm text-neutral-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50'
                        >
                            {Object.values(GROUP_PERMISSIONS).map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    {/* Manager */}
                    <div>
                        <label className='block text-xs text-neutral-500 dark:text-neutral-300 mb-1.5'>
                            Manager
                        </label>
                        <select
                            value={managerId}
                            onChange={(e) => setManagerId(e.target.value)}
                            disabled={isCreating || isLoadingMembers}
                            className='w-full h-10 px-3 rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm text-neutral-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50'
                        >
                            <option value=''>Unassigned</option>
                            {orgMembers.map((m) => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Members */}
                    <div>
                        <label className='block text-xs text-neutral-500 dark:text-neutral-300 mb-1.5'>
                            Members ({selectedMemberIds.length} selected)
                        </label>
                        <div className='max-h-[160px] overflow-y-auto custom-scrollbar rounded-lg border border-stroke-200 dark:border-neutral-700'>
                            {isLoadingMembers ? (
                                <div className='flex items-center justify-center py-6'>
                                    <div className='w-5 h-5 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin' />
                                </div>
                            ) : orgMembers.length === 0 ? (
                                <p className='py-6 text-center text-sm text-neutral-300 dark:text-neutral-400'>
                                    No members available
                                </p>
                            ) : (
                                <ul>
                                    {orgMembers.map((m) => (
                                        <li key={m.id}>
                                            <button
                                                type='button'
                                                onClick={() => toggleMember(m.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors border-b border-stroke-100 dark:border-neutral-800 last:border-b-0
                                                    ${selectedMemberIds.includes(m.id)
                                                        ? 'bg-primary-50 dark:bg-primary-500/10'
                                                        : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
                                                    }`}
                                            >
                                                <input
                                                    type='checkbox'
                                                    checked={selectedMemberIds.includes(m.id)}
                                                    readOnly
                                                    className='w-4 h-4 flex-shrink-0 pointer-events-none'
                                                />
                                                <span className='flex-1 min-w-0 text-sm text-neutral-500 dark:text-white truncate'>
                                                    {m.name}
                                                </span>
                                                <span className='flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-300'>
                                                    {m.role}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className='flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-1'>
                        <button
                            onClick={handleClose}
                            disabled={isCreating}
                            className='flex justify-center items-center h-9 px-4 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={isCreating || !name.trim()}
                            className='flex justify-center items-center gap-2 h-9 px-5 rounded-lg border border-[#5749BF] bg-gradient-primary text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50'
                        >
                            {isCreating ? (
                                <>
                                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                    Creating...
                                </>
                            ) : (
                                'Create group'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default CreateGroupModal;