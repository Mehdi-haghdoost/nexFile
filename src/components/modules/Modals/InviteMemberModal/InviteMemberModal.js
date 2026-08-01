'use client';
import React, { useState } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import useModalStore from '@/store/ui/modalStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { CloseIcon, CopyLinkIcon } from '@/components/ui/icons';
import { MEMBER_ROLES } from '@/utils/constants/membersConstants';

const InviteMemberModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen, data } = modals.inviteMember || {};

    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Member');
    const [isCreating, setIsCreating] = useState(false);
    const [inviteLink, setInviteLink] = useState('');

    const handleClose = () => {
        setEmail('');
        setRole('Member');
        setInviteLink('');
        closeModal('inviteMember');
    };

    const handleCreate = async () => {
        setIsCreating(true);
        try {
            const orgParam = data?.organizationId ? `?orgId=${data.organizationId}` : '';
            const res = await fetch(`/api/admin/members${orgParam}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() || null, role }),
            });
            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(result.message || 'Failed to create invite');
            }

            setInviteLink(`${window.location.origin}/invite/${result.invite.token}`);
            showSuccessToast('Invite link created');
        } catch (error) {
            showErrorToast(error.message || 'Failed to create invite');
        } finally {
            setIsCreating(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            showSuccessToast('Link copied to clipboard!');
        } catch {
            showErrorToast('Failed to copy link');
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='440px'>
            <div className='w-full'>
                <div className='flex items-center justify-between mb-4 sm:mb-5'>
                    <h2 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white'>
                        Invite member{data?.organizationName ? ` to ${data.organizationName}` : ''}
                    </h2>
                    <button
                        onClick={handleClose}
                        className='p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors'
                        aria-label='Close'
                    >
                        <CloseIcon />
                    </button>
                </div>

                {inviteLink ? (
                    <div className='flex flex-col gap-3'>
                        <p className='text-sm text-neutral-500 dark:text-neutral-300'>
                            Share this link with the person you want to invite. It expires in 7 days.
                        </p>
                        <div className='flex items-center gap-2 h-11 px-3 rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-800'>
                            <p className='flex-1 truncate text-sm text-neutral-500 dark:text-white'>{inviteLink}</p>
                            <button
                                onClick={handleCopy}
                                className='flex-shrink-0 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors'
                                aria-label='Copy link'
                            >
                                <CopyLinkIcon />
                            </button>
                        </div>
                        <button
                            onClick={handleClose}
                            className='mt-1 h-9 rounded-lg bg-gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity'
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <div className='flex flex-col gap-4'>
                        <div>
                            <label className='block text-xs text-neutral-500 dark:text-neutral-300 mb-1.5'>
                                Email (optional label)
                            </label>
                            <input
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='name@example.com'
                                className='w-full h-10 px-3 rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm text-neutral-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500'
                            />
                            <p className='mt-1 text-[11px] text-neutral-300 dark:text-neutral-500'>
                                No email is sent — you&apos;ll get a link to share yourself.
                            </p>
                        </div>

                        <div>
                            <label className='block text-xs text-neutral-500 dark:text-neutral-300 mb-1.5'>
                                Role
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className='w-full h-10 px-3 rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm text-neutral-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500'
                            >
                                {Object.values(MEMBER_ROLES).map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleCreate}
                            disabled={isCreating}
                            className='mt-1 h-9 rounded-lg bg-gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50'
                        >
                            {isCreating ? 'Creating link...' : 'Create invite link'}
                        </button>
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

export default InviteMemberModal;