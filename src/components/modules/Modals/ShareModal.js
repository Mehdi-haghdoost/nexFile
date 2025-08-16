import BaseModal from '@/components/layouts/Modal/BaseModal'
import {
    CloseIcon,
    CopyIcon,
    GlobeIcon,
    PermissionsDropdownIcon,
    PublicAccessDropdownIcon,
    SearchIcon,
    SettingsIcon
} from '@/components/ui/icons';

import useModalStore from '@/store/modalStore'
import React, { useEffect, useRef, useState } from 'react'

const ShareModal = () => {
    const { modals, closeModal } = useModalStore();

    const [isLoading, setIsLoading] = useState(false);
    const [shareLink, setShareLink] = useState('https://keepcloud.com/folders/0B8MXxVL7sSStfjlBVnhQUk92SGVpSGl3WmFCQVMySE5EbGllOE9BU2hZeFk3SFhaQV9XWWc?resourcekey=0-UX80l5-84OSFv0QHOw4ejw&usp=sharing')
    const [searchTerm, setSearchTerm] = useState(''); //متنی که کاربر در اینپوت جستجو تایپ می‌کند را ذخیره می‌کند
    const [showDropdown, setShowDropdown] = useState(false); //وضعیت باز یا بسته بودن لیست نتایج جستجو را کنترل می‌کند
    const [invitedUsers, setInvitedUsers] = useState([]); // یک آرایه برای نگهداری لیست کاربرانی که برای اشتراک‌گذاری انتخاب شده‌اند.
    const searchContainerRef = useRef(null);

    const isOpen = modals.shareFolder?.isOpen || false;
    const data = modals.shareFolder?.data || null;

    const mockUsers = [
        {
            id: 1,
            name: 'Ruben Amorim',
            email: 'rubenamorim@gmail.com',
            avatar: '/images/nav_img.png',
        },
        {
            id: 2,
            name: 'Ruben Onsu',
            email: 'rubenonsu@gmail.com',
            avatar: '/images/nav_img.png'
        },
        {
            id: 3,
            name: 'Sarah Johnson',
            email: 'sarah.johnson@gmail.com',
            avatar: '/images/nav_img.png'
        },
        {
            id: 4,
            name: 'Mike Wilson',
            email: 'mike.wilson@gmail.com',
            avatar: '/images/nav_img.png'
        }
    ];

    // فیلتر کردن کاربران بر اساس جستجو
    const filteredUsers = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        closeModal('shareFolder')
    }

    // هندل کردن تغییر متن جستجو
    const handleSearchChange = (e) => {
        const value = e.target.value;
        console.log('Search value:', value); // برای دیباگ
        setSearchTerm(value);
        setShowDropdown(value.length > 0);
    }

    // هندل کردن انتخاب user
    const handleSelectUser = (e,user) => {
        e.stopPropagation();
        console.log('Selected user:', user); // برای دیباگ
        // اینجا بررسی کردم که آیا این کاربر قبلا دعوت شده یا نشده
        const isAlreadyInvited = invitedUsers.find(invitedUser => invitedUser.id === user.id);
        if (!isAlreadyInvited) {
            setInvitedUsers([...invitedUsers, { ...user, permission: 'view' }]);
        }

        setSearchTerm('');
        setShowDropdown(false);
    }

    //حذف کاربر دعوت شده
    const handleRemoveUser = (e, userId) => {
        e.stopPropagation();
        setInvitedUsers(invitedUsers.filter(user => user.id !== userId));
    }

    //تغییر سطح دسترسی کاربر
    const handlePermissionChange = (userId, permission) => {
        setInvitedUsers(invitedUsers.map(user =>
            user.id === userId ? { ...user, permission } : user
        ));
    }

    //هندل کردن کپی لینک
    const handleCopyLink = async (e) => {
        e.stopPropagation();
        try {
            setIsLoading(true);
            await navigator.clipboard.writeText(shareLink);
            alert('Link copied successfully!')
        } catch (error) {
            console.error('خطا در کپی کردن :', error);
            alert('Error copying link')
        } finally {
            setIsLoading(false);
        }
    }

    //هندل کردن اشتراک گذاری فولدر
    const handleShareFolder = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);

            // شبیه سازی ارسال req به سرور
            const response = await fetch('/api/share-folder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    folderId: data?.folderId,
                    invitedUsers: invitedUsers,
                    permissions: 'view',
                })
            });

            if (response.ok) {
                // success
                alert('Folder shared successfully!')
                handleClose();
            } else {
                throw new Error('Error sharing folder');
            }
        } catch (error) {
            console.error('خطا در اشتراک گذاری', error);
            alert('Error sharing folder');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='520px'>
            <div className="w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-medium-18 ">Share folder "Design File"</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Form */}
                <form 
                onSubmit={handleShareFolder} 
                className="flex flex-col items-start gap-6 self-stretch">

                    {/* Search Container with relative positioning */}
                    <div className="relative w-full" ref={searchContainerRef}>
                        <div className='flex items-center h-8 gap-2 px-3 py-2 rounded-lg border border-primary-500 bg-white shadow-[0_0_4px_0_rgba(76,60,198,0.16)] self-stretch'>
                            <SearchIcon />
                            <div className="w-[1px] h-4 bg-[#A1A1A3]/50"></div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onFocus={() => searchTerm.length > 0 && setShowDropdown(true)}
                                className='w-full h-full text-sm bg-transparent outline-none placeholder-regular-12-manrope'
                                disabled={isLoading}
                                placeholder='Search people... (try: ruben, sarah, mike)'
                            />
                        </div>

                        {/* Debug Info - for testing only */}
                        {searchTerm && (
                            <div className="text-xs text-gray-500 mt-1">
                                Search: "{searchTerm}" | Results: {filteredUsers.length} | Show dropdown: {showDropdown ? 'Yes' : 'No'}
                            </div>
                        )}

                        {/* Dropdown Results */}
                        {showDropdown && filteredUsers.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E1E0E5] rounded-lg shadow-xl z-[9999] max-h-48 overflow-y-auto">
                                <div className="p-2 bg-blue-50 text-xs text-blue-600">
                                    {filteredUsers.length} users found
                                </div>
                                {filteredUsers.map(user => (
                                    <div
                                        key={user.id}
                                        onClick={(e) => handleSelectUser(e,user)}
                                        className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                    >
                                        <img
                                            src={user.avatar}
                                            className='w-8 h-8 rounded-full border'
                                            alt={user.name}
                                            onError={(e) => {
                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNFNUU3RUIiLz4KPHRleHQgeD0iMTYiIHk9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjc3NDg5IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiPjw+PC90ZXh0Pgo8L3N2Zz4K'
                                            }}
                                        />
                                        <div className='flex-1'>
                                            <p className='text-medium-14 text-gray-900'>{user.name}</p>
                                            <p className='text-regular-12 text-gray-500'>{user.email}</p>
                                        </div>
                                        <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                            Select
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* No Results Message */}
                        {showDropdown && searchTerm.length > 0 && filteredUsers.length === 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E1E0E5] rounded-lg shadow-xl z-[9999]">
                                <div className="p-4 text-center text-gray-500">
                                    <div className="text-2xl mb-2">😔</div>
                                    <p className="font-medium">No users found</p>
                                    <p className="text-xs mt-1 text-gray-400">You searched for "{searchTerm}"</p>
                                    <p className="text-xs mt-2 text-blue-600">
                                        Try: ruben, sarah, mike
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Invited Users List */}
                    {invitedUsers.length > 0 && (
                        <div className='flex flex-col items-start gap-3 self-stretch'>
                            <div className="flex items-center justify-between w-full">
                                <p className='text-regular-12-neutral-300'>Invited users</p>
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    {invitedUsers.length} people
                                </span>
                            </div>
                            {invitedUsers.map(user => (
                                <div key={user.id} className='flex items-center h-[50px] gap-3 self-stretch bg-green-50 border border-green-200 rounded-lg px-3'>
                                    <img
                                        src={user.avatar}
                                        className='w-[36px] h-[36px] rounded-full border-2 border-green-300'
                                        alt={user.name}
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iMTgiIGZpbGw9IiM0QUY1MEEiLz4KPHN2ZyB4PSI5IiB5PSI5IiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIGZpbGw9IndoaXRlIj4KICA8cGF0aCBkPSJNOSAwQzQuMDMgMCAwIDQuMDMgMCA5czQuMDMgOSA5IDkgOS00LjAzIDktOVM4LjU3IDAgOSAwem0wIDRjMS42NiAwIDMgMS4zNCAzIDNzLTEuMzQgMy0zIDMtMy0xLjM0LTMtM1M3LjM0IDQgOSA0em0wIDEwYy0yLjMzIDAtNC4zMS0xLjE5LTUuNS0zQzQuNjkgOC42OSA2LjY3IDggOSA4czQuMzEuNjkgNS41IDMuNUM5LjMxIDEzLjgxIDExLjMzIDE0IDkgMTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4K'
                                        }}
                                    />
                                    <div className='flex flex-col flex-1 justify-center items-start'>
                                        <h2 className='text-medium-15 text-gray-900'>{user.name}</h2>
                                        <span className='text-regular-12 text-gray-600'>{user.email}</span>
                                    </div>
                                    <select
                                        value={user.permission}
                                        onChange={(e) => handlePermissionChange(user.id, e.target.value)}
                                        className='text-regular-12 border border-gray-300 rounded-md px-3 py-1 bg-white min-w-[90px]'
                                    >
                                        <option value="view">Can view</option>
                                        <option value="edit">Can edit</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <button
                                        type="button"
                                        onClick={(e) => handleRemoveUser(e, user.id)}
                                        className='text-red-500 hover:text-white hover:bg-red-500 text-xs px-3 py-1 rounded-md border border-red-300 transition-all duration-200'
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className='flex justify-center items-center h-12 py-3 px-4 gap-2 self-stretch rounded-lg border border-[#E1E0E5] bg-white'>
                        <p className='truncate flex-1 text-regular-14-manrope'>
                            {shareLink}
                        </p>
                        <button
                            type='button'
                            onClick={handleCopyLink}
                            disabled={isLoading}
                            className="disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 p-1 rounded"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
                            ) : (
                                <CopyIcon />
                            )}
                        </button>
                    </div>

                    <div className='flex flex-col items-start gap-2 self-stretch'>
                        <p className='text-regular-12-neutral-300'>Who has access</p>
                        <div className='flex items-center h-[42px] gap-3 self-stretch'>
                            <img src="/images/nav_img.png" className='w-[38px] h-[38px] rounded-[38px]' alt="nav_img.png" />
                            <div className='flex flex-col flex-1 justify-center items-start '>
                                <h2 className='text-medium-16 '>Ridwan T. (you)</h2>
                                <span className='text-regular-12'>ridwant@gmail.com</span>
                            </div>
                            <p className='text-regular-12-neutral-100'>Owner</p>
                        </div>
                    </div>

                    <div className='flex flex-col items-start gap-2 self-stretch'>
                        <div className='flex justify-between items-center self-stretch'>
                            <span className='text-regular-12'>Public access</span>
                            <div className='flex justify-center items-center gap1.5'>
                                <h3 className='text-medium-12'>Can view</h3>
                                <PermissionsDropdownIcon />
                            </div>
                        </div>
                        <div className='flex justify-center items-center h-[52px] py-3 px-4 gap-2 self-stretch rounded-lg border border-[#E1E0E5] bg-white'>
                            <GlobeIcon />
                            <div className='flex flex-col flex-1 justify-center items-start gap-0.5'>
                                <p className='text-medium-12'>Anyone who has a link</p>
                                <p className='text-regular-12-neutral-200'>Anyone with a link can see</p>
                            </div>
                            <PublicAccessDropdownIcon />
                        </div>
                    </div>

                    {/* Form Footer */}
                    <div className='flex justify-between items-center self-stretch mt-5'>
                        <button
                            type='button'
                            disabled={isLoading}
                            className='flex justify-center items-center w-8 h-8 gap-1 rounded-lg border border-[#ECECEE] bg-white shadow-light disabled:opacity-50'>
                            <SettingsIcon />
                        </button>
                        <button
                            type='submit'
                            onClick={handleShareFolder}
                            disabled={isLoading}
                            className='flex justify-center items-center h-8 py-[13px] px-6 gap-2 rounded-lg border border-[#5749BF] bg-gradient-primary shadow-[0_4px_8px_0_rgba(0,0,0,0.16)] text-medium-14-white text-center disabled:opacity-50'
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Sharing...
                                </>
                            ) : (
                                `Share folder${invitedUsers.length > 0 ? ` (${invitedUsers.length} people)` : ''}`
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </BaseModal>
    )
}

export default ShareModal