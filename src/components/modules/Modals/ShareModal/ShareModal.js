"use client";

import React, { useEffect, useRef, useState } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import {
    CloseEmailIcon,
    CopyLinkIcon,
    SearchIcon,
    SettingsIcon
} from '@/components/ui/icons';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

import useModalStore from '@/store/ui/modalStore';

import ShareModalHeader from './ShareModalHeader';
import UserSearchBox from './UserSearchBox';
import InvitedUsersList from './InvitedUsersList';
import ShareLinkSection from './ShareLinkSection';
import AccessControlSection from './AccessControlSection';
import ReviewHeader from './ReviewHeader';

const ShareModal = () => {
    const { modals, closeModal, openModal } = useModalStore();
    const { isOpen, data } = modals.shareFolder || {};

    // Extract data from modal
    const fileName = data?.fileName || 'Untitled';
    const fileType = data?.fileType || 'folder';
    const fileId = data?.fileId || null;

    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState('main');
    const [isSearching, setIsSearching] = useState(false);

    const [shareLink, setShareLink] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [shareNote, setShareNote] = useState('');
    const [sharedUsers, setSharedUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const searchContainerRef = useRef(null);

    // Generate share link when modal opens
    useEffect(() => {
        if (isOpen && fileId) {
            const link = `${window.location.origin}/${fileType}s/${fileId}`;
            setShareLink(link);
        }
    }, [isOpen, fileId, fileType]);

    // When the modal opens for an item, reset transient state and load the
    // real list of users this item is already shared with from the server.
    useEffect(() => {
        if (!isOpen || !fileId) return;

        // Reset transient state so nothing leaks from a previous item
        setInvitedUsers([]);
        setSelectedUser(null);
        setSearchTerm('');
        setSearchResults([]);
        setShareNote('');
        setView('main');
        setSharedUsers([]);

        let cancelled = false;

        const loadShares = async () => {
            try {
                const res = await fetch(
                    `/api/files/${fileId}/share?itemType=${fileType}`,
                    { credentials: 'include' }
                );
                const result = await res.json();

                if (!cancelled && res.ok && result.success) {
                    setSharedUsers(result.sharedUsers || []);
                }
            } catch (error) {
                console.log('Failed to load current shares:', error);
            }
        };

        loadShares();

        return () => {
            cancelled = true;
        };
    }, [isOpen, fileId, fileType]);

    // Search users from API
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        setIsSearching(true);
        const debounceTimer = setTimeout(() => {
            fetch(`/api/users/search?q=${searchTerm}`)
                .then(res => res.json())
                .then(users => {
                    // Exclude users already invited or already shared with
                    const newResults = users.filter(user =>
                        !invitedUsers.some(invited => invited.id === user.id) &&
                        !sharedUsers.some(shared => shared.id === user.id)
                    );
                    setSearchResults(newResults);
                    setShowDropdown(true);
                })
                .catch(error => {
                    console.log('API search failed:', error);
                    setSearchResults([]);
                })
                .finally(() => setIsSearching(false));

        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, invitedUsers, sharedUsers]);

    // Hide dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    const handleClose = () => {
        closeModal('shareFolder');
        setSearchTerm('');
        setInvitedUsers([]);
        setSearchResults([]);
        setView('main');
        setSelectedUser(null);
        setShareNote('');
        setShowDropdown(false);
        setSharedUsers([]);
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleSelectUser = (e, user) => {
        e.stopPropagation();
        const isAlreadyInvited = invitedUsers.find(invited => invited.id === user.id);
        const isAlreadyShared = sharedUsers.find(shared => shared.id === user.id);

        if (!isAlreadyInvited && !isAlreadyShared) {
            setInvitedUsers(prevUsers => [...prevUsers, { ...user, permission: 'view' }]);
        }
        setSearchTerm('');
        setShowDropdown(false);
        setSearchResults([]);
    }

    const handleRemoveUser = (e, userId) => {
        e.stopPropagation();
        setInvitedUsers(invitedUsers.filter(user => user.id !== userId));
    }

    const handleProceedToReview = (user) => {
        setSelectedUser(user);
        setView('review')
    };

    const handleCopyLink = async (e) => {
        e.stopPropagation();
        try {
            setIsLoading(true);
            await navigator.clipboard.writeText(shareLink);
            showSuccessToast('Link copied successfully!');
        } catch (error) {
            console.error('Error copying link:', error);
            showErrorToast('Error copying link');
        } finally {
            setIsLoading(false);
        }
    }

    const handleSendShare = async () => {
        if (!selectedUser || !fileId) return;

        setIsLoading(true);

        try {
            const res = await fetch(`/api/files/${fileId}/share`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    users: [
                        { id: selectedUser.id, permission: selectedUser.permission || 'view' },
                    ],
                    itemType: fileType, // 'file' | 'folder'
                }),
            });

            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(result.message || 'Failed to share');
            }

            // Add to the shared list locally so it shows immediately
            const isAlreadyShared = sharedUsers.find((s) => s.id === selectedUser.id);
            if (!isAlreadyShared) {
                setSharedUsers((prev) => [...prev, selectedUser]);
            }

            setInvitedUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
            setView('main');
            setSelectedUser(null);
            setShareNote('');

            const label = fileType.charAt(0).toUpperCase() + fileType.slice(1);
            showSuccessToast(`${label} shared successfully!`);
        } catch (error) {
            console.error('Share error:', error);
            showErrorToast(error.message || `Failed to share ${fileType}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenSettings = () => {
        closeModal('shareFolder');
        openModal('shareSettings', { returnTo: 'shareFolder' });
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='520px'>
            {view === 'main' ? (
                <div className="w-full">
                    <ShareModalHeader
                        onClose={handleClose}
                        isLoading={isLoading}
                        fileName={fileName}
                        fileType={fileType}
                    />

                    <form className="flex flex-col items-start gap-4 sm:gap-6 self-stretch">
                        <UserSearchBox
                            searchTerm={searchTerm}
                            handleSearchChange={handleSearchChange}
                            isLoading={isLoading}
                            showDropdown={showDropdown}
                            searchResults={searchResults}
                            isSearching={isSearching}
                            handleSelectUser={handleSelectUser}
                            searchContainerRef={searchContainerRef}
                        />

                        <InvitedUsersList
                            invitedUsers={invitedUsers}
                            handleRemoveUser={handleRemoveUser}
                            handleProceedToReview={handleProceedToReview}
                        />

                        <ShareLinkSection
                            shareLink={shareLink}
                            isLoading={isLoading}
                            handleCopyLink={handleCopyLink}
                        />

                        <AccessControlSection sharedUsers={sharedUsers} />

                        <div className='flex justify-between items-center self-stretch mt-3 sm:mt-5'>
                            <button
                                type='button'
                                onClick={handleOpenSettings}
                                disabled={isLoading}
                                className='flex justify-center items-center w-7 h-7 sm:w-8 sm:h-8 gap-1 rounded-lg border border-[#ECECEE] bg-white shadow-light disabled:opacity-50 dark:bg-dark-gradient dark:border-dark-border hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors'>
                                <SettingsIcon />
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="w-full">
                    <ReviewHeader
                        setView={setView}
                        handleClose={handleClose}
                        fileName={fileName}
                        fileType={fileType}
                    />

                    <form onSubmit={(e) => { e.preventDefault(); handleSendShare(); }}>
                        <div className='flex flex-col items-start gap-3 sm:gap-4 self-stretch'>
                            <div className='flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-2 self-stretch'>
                                <div className='flex flex-1 items-center h-8 sm:h-8 gap-2 px-2 sm:px-3 py-2 rounded-lg border border-primary-500 bg-white dark:bg-neutral-800 shadow-[0_0_4px_0_rgba(76,60,198,0.16)] self-stretch'>
                                    <SearchIcon className="w-4 h-4 shrink-0" />
                                    <div className="w-[1px] h-4 bg-[#A1A1A3]/50"></div>
                                    <input
                                        type="text"
                                        value={selectedUser?.email || ''}
                                        readOnly
                                        className='w-full h-full text-xs sm:text-sm text-neutral-300 dark:text-white bg-transparent outline-none placeholder:text-xs sm:placeholder:text-sm'
                                        placeholder='Select a user first'
                                    />
                                    <CloseEmailIcon className="w-4 h-4 shrink-0" />
                                </div>
                                <div className='flex justify-center items-center h-8 py-2 sm:py-[13px] pr-2 sm:pr-3 pl-3 sm:pl-4 gap-1 text-xs sm:text-sm font-medium outline-0 text-center rounded-lg border border-[#E1E0E5] bg-white shadow-light dark:bg-dark-gradient dark:border-dark-border'>
                                    <select
                                        value={selectedUser?.permission || 'view'}
                                        onChange={(e) => {
                                            if (selectedUser) {
                                                setSelectedUser({ ...selectedUser, permission: e.target.value });
                                                setInvitedUsers(prev =>
                                                    prev.map(user =>
                                                        user.id === selectedUser.id
                                                            ? { ...user, permission: e.target.value }
                                                            : user
                                                    )
                                                );
                                            }
                                        }}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white bg-transparent border-none outline-none [&>option]:bg-white [&>option]:dark:bg-neutral-800 [&>option]:text-neutral-500 [&>option]:dark:text-white'
                                        disabled={!selectedUser}
                                    >
                                        <option value="view">Can view</option>
                                        <option value="edit">Can edit</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className='flex flex-col justify-center items-center gap-1 h-[80px] sm:h-[100px] self-stretch'>
                                <p className='text-xs text-neutral-300 dark:text-white self-stretch'>Add a note (optional)</p>
                                <textarea
                                    value={shareNote}
                                    onChange={(e) => setShareNote(e.target.value)}
                                    className='flex py-2 sm:py-3 px-3 sm:px-4 gap-2 flex-1 self-stretch rounded-lg border border-[#E1E0E5] bg-white dark:bg-neutral-800 dark:border-neutral-600 outline-0 text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 resize-none'
                                    placeholder="Write a note for the recipient..."
                                    disabled={!selectedUser}
                                />
                            </div>
                        </div>

                        <div className='flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0 self-stretch mt-3 sm:mt-5'>
                            <button
                                type='button'
                                onClick={handleOpenSettings}
                                disabled={isLoading}
                                className='flex justify-center items-center w-full sm:w-7 sm:h-7 md:w-8 md:h-8 h-9 gap-1 rounded-lg border border-[#ECECEE] bg-white shadow-light disabled:opacity-50 dark:bg-dark-gradient dark:border-dark-border hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors'>
                                <SettingsIcon />
                            </button>
                            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto'>
                                <button
                                    type="button"
                                    onClick={handleCopyLink}
                                    className='flex justify-center items-center gap-1 py-2 sm:py-[13px] pr-3 sm:pr-4 pl-2 sm:pl-3 h-9 sm:h-8 rounded-lg border border-[#ECECEE] bg-white dark:bg-dark-gradient dark:border-dark-border text-xs sm:text-sm text-neutral-500 dark:text-white shadow-middle hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors'>
                                    <CopyLinkIcon />
                                    Copy link
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !selectedUser}
                                    className='flex justify-center items-center py-2 sm:py-[13px] px-4 sm:px-6 gap-2 h-9 sm:h-8 rounded-lg border border-[#5749BF] bg-gradient-primary shadow-[0_4px_8px_0_rgba(0,0,0,0.16)] text-xs sm:text-sm font-medium text-white text-center disabled:opacity-50 hover:opacity-90 transition-opacity'>
                                    {isLoading ? (
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
                    </form>
                </div>
            )}
        </BaseModal>
    );
};

export default ShareModal;