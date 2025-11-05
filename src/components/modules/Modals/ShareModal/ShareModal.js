"use client";

import React, { useEffect, useRef, useState } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import {
    ChevronDownIcon,
    CloseEmailIcon,
    CopyLinkIcon,
    SearchIcon,
    SettingsIcon
} from '@/components/ui/icons';

import useModalStore from '@/store/ui/modalStore';



import ShareModalHeader from './ShareModalHeader';
import UserSearchBox from './UserSearchBox';
import InvitedUsersList from './InvitedUsersList';
import ShareLinkSection from './ShareLinkSection';
import AccessControlSection from './AccessControlSection';
import ReviewHeader from './ReviewHeader';

const ShareModal = () => {
    // --- STATE MANAGEMENT ---
    const { modals, closeModal, openModal } = useModalStore();
    const { isOpen, data } = modals.shareFolder || {};

    // State برای کنترل UI
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState('main');
    const [isSearching, setIsSearching] = useState(false);

    // State برای داده‌ها
    const [shareLink, setShareLink] = useState('https://NexFile.com/folders/0B8MXxVL7sSStfjlBVnhQUk92SGVpSGl3WmFCQVMySE5EbGllOE9BU2hZeFk3SFhaQV9XWWc?resourcekey=0-UX80l5-84OSFv0QHOw4ejw&usp=sharing')
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [shareNote, setShareNote] = useState('');
    const [sharedUsers, setSharedUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const searchContainerRef = useRef(null);

    // جستجوی کاربران از API
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

    // مخفی کردن dropdown وقتی خارج از آن کلیک میشود
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
    }

    // هندل کردن تغییر متن جستجو
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    // هندل کردن انتخاب user
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

    //حذف کاربر دعوت شده
    const handleRemoveUser = (e, userId) => {
        e.stopPropagation();
        setInvitedUsers(invitedUsers.filter(user => user.id !== userId));
    }

    // رفتن به صفحه review با کاربر انتخاب شده
    const handleProceedToReview = (user) => {
        setSelectedUser(user);
        setView('review')
    };

    //هندل کردن کپی لینک
    const handleCopyLink = async (e) => {
        e.stopPropagation();
        try {
            setIsLoading(true);
            await navigator.clipboard.writeText(shareLink);
            alert('Link copied successfully!')
        } catch (error) {
            console.error('Error copying link:', error);
            alert('Error copying link')
        } finally {
            setIsLoading(false);
        }
    }

    //  ارسال دعوت نامه اشتراک گذاری
    const handleSendShare = async () => {
        if (!selectedUser) return;

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const isAlreadyShared = sharedUsers.find(shared => shared.id === selectedUser.id);
            if (!isAlreadyShared) {
                console.log(`Sharing folder with :`, {
                    folderId: data?.folderId,
                    user: selectedUser,
                    permission: selectedUser.permission,
                    note: shareNote,
                });

                setSharedUsers(prev => [...prev, selectedUser]);
                alert('Folder shared successfully!');
            } else {
                alert('User already has access to this folder!');
            }

            setInvitedUsers(prev => prev.filter(user => user.id !== selectedUser.id))
            setView('main');
            setSelectedUser(null);
            setShareNote('');
        } catch (error) {
            console.error('Share error:', error);
            alert('Failed to share folder');
        } finally {
            setIsLoading(false);
        }
    }

    const handleOpenSettings = () => {
        closeModal('shareFolder');
        openModal('shareSettings');
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='520px'>
            {view === 'main' ? (
                <div className="w-full">
                    <ShareModalHeader onClose={handleClose} isLoading={isLoading} />

                    <form className="flex flex-col items-start gap-6 self-stretch">
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

                        <div className='flex justify-between items-center self-stretch mt-5'>
                            <button
                                type='button'
                                onClick={handleOpenSettings}
                                disabled={isLoading}
                                className='flex justify-center items-center w-8 h-8 gap-1 rounded-lg border border-[#ECECEE] bg-white shadow-light disabled:opacity-50 dark:bg-dark-gradient dark:border-dark-border'>
                                <SettingsIcon />
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="w-full">
                    <ReviewHeader setView={setView} handleClose={handleClose} />

                    <form onSubmit={(e) => { e.preventDefault(); handleSendShare(); }}>
                        <div className='flex flex-col items-start gap-4 self-stretch'>
                            <div className='flex justify-center items-center gap-2 self-stretch'>
                                <div className='flex flex-1 items-center h-8 gap-2 px-3 py-2 rounded-lg border border-primary-500 bg-white dark:bg-neutral-800 shadow-[0_0_4px_0_rgba(76,60,198,0.16)] self-stretch'>
                                    <SearchIcon />
                                    <div className="w-[1px] h-4 bg-[#A1A1A3]/50"></div>
                                    <input
                                        type="text"
                                        value={selectedUser?.email || ''}
                                        readOnly
                                        className='w-full h-full text-regular-12 dark:text-regular-12-white bg-transparent outline-none placeholder-regular-12-manrope'
                                        placeholder='Select a user first'
                                    />
                                    <CloseEmailIcon />
                                </div>
                                <div className='flex justify-center items-center h-8 py-[13px] pr-3 pl-4 gap-1 text-medium-14 ouline-0 text-center rounded-lg border border-[#E1E0E5] bg-white shadow-light dark:bg-dark-gradient dark:border-dark-border'>
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
                                        className='text-medium-14 dark:text-medium-14-white bg-transparent dark:bg-neutral-800 border-none outline-none [&>option]:bg-white [&>option]:dark:bg-neutral-800 [&>option]:text-neutral-500 [&>option]:dark:text-white'
                                        disabled={!selectedUser}
                                    >
                                        <option value="view">Can view</option>
                                        <option value="edit">Can edit</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className='flex flex-col justify-center items-center gap-1 h-[100px] self-stretch'>
                                <p className='text-regular-12-neutral-300 self-stretch'>Add a note (optional)</p>
                                <textarea
                                    value={shareNote}
                                    onChange={(e) => setShareNote(e.target.value)}
                                    className='flex py-3 px-4 gap-2 flex-1 self-stretch rounded-lg border border-[#E1E0E5] bg-white dark:bg-neutral-800 dark:border-neutral-600 outline-0 dark:text-regular-14-neutral-300 resize-none'
                                    placeholder="Write a note for the recipient..."
                                    disabled={!selectedUser}
                                />
                            </div>
                        </div>

                        <div className='flex justify-between items-center self-stretch mt-5'>
                            <button
                                type='button'
                                disabled={isLoading}
                                className='flex justify-center items-center w-8 h-8 gap-1 rounded-lg border border-[#ECECEE] bg-white shadow-light disabled:opacity-50 dark:bg-dark-gradient dark:border-dark-border'>
                                <SettingsIcon />
                            </button>
                            <div className='flex items-center gap-3'>
                                <button
                                    type="button"
                                    onClick={handleCopyLink}
                                    className='flex justify-center items-center gap-1 py-[13px] pr-4 pl-3 h-8 rounded-lg border border-[#ECECEE] bg-white dark:bg-dark-gradient dark:border-dark-border text-regular-14 dark:text-regular-14-white shadow-middle'>
                                    <CopyLinkIcon />
                                    Copy link
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !selectedUser}
                                    className='flex justify-center items-center py-[13px] px-6 gap-2 h-8 rounded-lg border border-[#5749BF] bg-gradient-primary shadow-[0_4px_8px_0_rgba(0,0,0,0.16)] text-medium-14-white text-center disabled:opacity-50'>
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