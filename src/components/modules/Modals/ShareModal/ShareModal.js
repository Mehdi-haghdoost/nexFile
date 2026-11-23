"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { SettingsIcon } from '@/components/ui/icons';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { showConfirmDialog } from '@/lib/sweetAlert';
import { api } from '@/lib/fetchWithAuth';
import { copyTextToClipboard } from '@/utils/clipboard';
import { useItemAccess } from '@/hooks/sharing/useItemAccess';
import useModalStore from '@/store/ui/modalStore';

import ShareModalHeader from './ShareModalHeader';
import UserSearchBox from './UserSearchBox';
import InvitedUsersList from './InvitedUsersList';
import ShareLinkSection from './ShareLinkSection';
import AccessControlSection from './AccessControlSection';

const NOTE_MAX_LENGTH = 500;
const SEARCH_DELAY_MS = 300;

// A dead session already redirects to login inside fetchWithAuth, so it gets no toast
const toastError = (error, fallback) => {
    if (error?.message !== 'Session expired') showErrorToast(error?.message || fallback);
};

const ShareModal = () => {
    const { modals, closeModal, openModal } = useModalStore();
    const { isOpen, data } = modals.shareFolder || {};

    const fileName = data?.fileName || 'Untitled';
    const fileType = data?.fileType === 'file' ? 'file' : 'folder';
    const fileId = data?.fileId || null;

    // Nothing is loaded while the modal is closed or was opened without an item
    const { access, isLoading, error, reload, addPeople, changeRole, removePerson } =
        useItemAccess(isOpen ? fileId : null, fileType);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [shareNote, setShareNote] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const [busyUserId, setBusyUserId] = useState(null);

    const searchContainerRef = useRef(null);
    const latestSearch = useRef(0);

    const you = access?.you;
    const canShare = Boolean(you?.canShare);
    const roleOptions = you?.grantableRoles || [];

    // The in-app address, which opens only for people with access
    const shareLink = fileId && typeof window !== 'undefined'
        ? `${window.location.origin}/${fileType === 'folder' ? 'folder' : 'file'}/${fileId}`
        : '';

    // People already on the list never show up as search results
    const listedIds = useMemo(() => {
        if (!access) return new Set();
        return new Set([access.owner.id, access.you.id, ...access.people.map((person) => person.id)]);
    }, [access]);

    // Each opening starts clean, so nothing carries over from another item
    useEffect(() => {
        if (!isOpen) return;

        setSearchTerm('');
        setSearchResults([]);
        setShowDropdown(false);
        setInvitedUsers([]);
        setShareNote('');
        setBusyUserId(null);
    }, [isOpen, fileId]);

    // Searches after typing pauses; an older answer never replaces a newer one
    useEffect(() => {
        const term = searchTerm.trim();

        if (!term) {
            latestSearch.current += 1;
            setSearchResults([]);
            setShowDropdown(false);
            setIsSearching(false);
            return undefined;
        }

        const searchId = ++latestSearch.current;
        setIsSearching(true);

        const timer = setTimeout(async () => {
            try {
                const response = await api.get(`/api/users/search?q=${encodeURIComponent(term)}`);
                const users = response.ok ? await response.json() : [];

                if (searchId !== latestSearch.current) return;

                setSearchResults(
                    (Array.isArray(users) ? users : []).filter(
                        (user) => !listedIds.has(user.id) && !invitedUsers.some((invited) => invited.id === user.id)
                    )
                );
                setShowDropdown(true);
            } catch (err) {
                if (searchId === latestSearch.current) setSearchResults([]);
            } finally {
                if (searchId === latestSearch.current) setIsSearching(false);
            }
        }, SEARCH_DELAY_MS);

        return () => clearTimeout(timer);
    }, [searchTerm, listedIds, invitedUsers]);

    // Hide dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClose = () => {
        if (isSending) return;
        closeModal('shareFolder');
    };

    const handleSelectUser = (event, user) => {
        event.stopPropagation();

        if (!invitedUsers.some((invited) => invited.id === user.id)) {
            // Starts at the lowest role; the dropdown offers only roles the caller may give
            setInvitedUsers((prev) => [...prev, { ...user, permission: roleOptions[0] || 'view' }]);
        }

        setSearchTerm('');
        setSearchResults([]);
        setShowDropdown(false);
    };

    const handleInviteRoleChange = (userId, permission) => {
        setInvitedUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, permission } : user)));
    };

    const handleInviteRemove = (userId) => {
        setInvitedUsers((prev) => prev.filter((user) => user.id !== userId));
    };

    // Shares with everyone picked in one request, with one note for all of them
    const handleSend = async () => {
        if (invitedUsers.length === 0 || isSending) return;

        setIsSending(true);
        try {
            const result = await addPeople(
                invitedUsers.map((user) => ({ id: user.id, permission: user.permission })),
                shareNote
            );

            showSuccessToast(result.message);
            setInvitedUsers([]);
            setShareNote('');
        } catch (err) {
            toastError(err, 'Failed to share');
        } finally {
            setIsSending(false);
        }
    };

    const handleChangeRole = async (person, permission) => {
        if (permission === person.role) return;

        setBusyUserId(person.id);
        try {
            await changeRole(person.id, permission);
            showSuccessToast(`Access updated for ${person.name}`);
        } catch (err) {
            toastError(err, 'Failed to change access');
        } finally {
            setBusyUserId(null);
        }
    };

    const handleRemove = async (person) => {
        const confirmed = await showConfirmDialog({
            title: `Remove ${person.name}?`,
            text: `They will no longer have direct access to "${fileName}".`,
            confirmButtonText: 'Remove',
            cancelButtonText: 'Cancel',
        });
        if (!confirmed) return;

        setBusyUserId(person.id);
        try {
            await removePerson(person.id);
            showSuccessToast(`${person.name} no longer has access`);
        } catch (err) {
            toastError(err, 'Failed to remove access');
        } finally {
            setBusyUserId(null);
        }
    };

    const handleCopyLink = async (event) => {
        event?.stopPropagation();
        if (!shareLink) return;

        setIsCopying(true);
        const copied = await copyTextToClipboard(shareLink);
        setIsCopying(false);

        if (copied) showSuccessToast('Link copied. It opens only for people with access.');
        else showErrorToast('Failed to copy link');
    };

    // Manage access returns here afterwards, with the same item
    const handleOpenSettings = () => {
        closeModal('shareFolder');
        openModal('shareSettings', { fileName, fileId, fileType, returnTo: 'shareFolder' });
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='520px'>
            <div className="w-full">
                <ShareModalHeader onClose={handleClose} isLoading={isSending} fileName={fileName} fileType={fileType} />

                {!fileId ? (
                    <p className='text-sm text-neutral-300 dark:text-neutral-300'>Choose a file or folder to share first.</p>
                ) : (
                    <form
                        className="flex flex-col items-start gap-4 sm:gap-6 self-stretch"
                        onSubmit={(event) => { event.preventDefault(); handleSend(); }}
                    >
                        {access && !canShare && (
                            <p className='self-stretch text-xs text-neutral-300 dark:text-neutral-300 rounded-lg border border-[#E1E0E5] dark:border-neutral-600 px-3 py-2'>
                                Only the owner, or people allowed by this {fileType}'s Control permissions, can add people.
                            </p>
                        )}

                        {canShare && (
                            <>
                                <UserSearchBox
                                    searchTerm={searchTerm}
                                    handleSearchChange={(event) => setSearchTerm(event.target.value)}
                                    isLoading={isSending}
                                    showDropdown={showDropdown}
                                    searchResults={searchResults}
                                    isSearching={isSearching}
                                    handleSelectUser={handleSelectUser}
                                    searchContainerRef={searchContainerRef}
                                />

                                <InvitedUsersList
                                    invitedUsers={invitedUsers}
                                    roleOptions={roleOptions}
                                    onRoleChange={handleInviteRoleChange}
                                    onRemove={handleInviteRemove}
                                    disabled={isSending}
                                />

                                {invitedUsers.length > 0 && (
                                    <div className='flex flex-col gap-1 self-stretch'>
                                        <div className='flex justify-between items-center'>
                                            <label htmlFor='share-note' className='text-xs text-neutral-300 dark:text-white'>Add a note (optional)</label>
                                            <span className='text-[11px] text-neutral-300'>{shareNote.length}/{NOTE_MAX_LENGTH}</span>
                                        </div>
                                        <textarea
                                            id='share-note'
                                            dir='auto'
                                            value={shareNote}
                                            maxLength={NOTE_MAX_LENGTH}
                                            disabled={isSending}
                                            onChange={(event) => setShareNote(event.target.value)}
                                            placeholder='Write a note for everyone you are inviting...'
                                            className='h-[72px] sm:h-[84px] py-2 px-3 rounded-lg border border-[#E1E0E5] bg-white dark:bg-neutral-800 dark:border-neutral-600 outline-0 text-xs sm:text-sm text-neutral-500 dark:text-neutral-200 resize-none'
                                        />
                                        <div className='flex justify-end mt-2'>
                                            <button
                                                type='submit'
                                                disabled={isSending}
                                                className='flex justify-center items-center gap-2 h-9 sm:h-8 px-4 sm:px-6 rounded-lg border border-[#5749BF] bg-gradient-primary shadow-[0_4px_8px_0_rgba(0,0,0,0.16)] text-xs sm:text-sm font-medium text-white disabled:opacity-50 hover:opacity-90 transition-opacity'
                                            >
                                                {isSending ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        Sending...
                                                    </>
                                                ) : (
                                                    'Send'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <ShareLinkSection shareLink={shareLink} isLoading={isCopying} handleCopyLink={handleCopyLink} />

                        <AccessControlSection
                            access={access}
                            isLoading={isLoading}
                            error={error}
                            onRetry={reload}
                            onChangeRole={handleChangeRole}
                            onRemove={handleRemove}
                            busyUserId={busyUserId}
                        />

                        {/* Manage access stays with the owner */}
                        {you?.canManageSettings && (
                            <div className='flex justify-between items-center self-stretch mt-1 sm:mt-2'>
                                <button
                                    type='button'
                                    onClick={handleOpenSettings}
                                    disabled={isSending}
                                    aria-label='Manage access settings'
                                    title='Manage access'
                                    className='flex justify-center items-center w-7 h-7 sm:w-8 sm:h-8 gap-1 rounded-lg border border-[#ECECEE] bg-white shadow-light disabled:opacity-50 dark:bg-dark-gradient dark:border-dark-border hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors'
                                >
                                    <SettingsIcon />
                                </button>
                            </div>
                        )}
                    </form>
                )}
            </div>
        </BaseModal>
    );
};

export default ShareModal;