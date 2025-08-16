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
import React, { useState } from 'react'

const ShareModal = () => {
    const { modals, closeModal } = useModalStore();

    const [isLoading, setIsLoading] = useState(false);
    const [shareLink, setShareLink] = useState('https://keepcloud.com/folders/0B8MXxVL7sSStfjlBVnhQUk92SGVpSGl3WmFCQVMySE5EbGllOE9BU2hZeFk3SFhaQV9XWWc?resourcekey=0-UX80l5-84OSFv0QHOw4ejw&usp=sharing')


    const isOpen = modals.shareFolder?.isOpen || false;
    const data = modals.shareFolder?.data || null;

    const handleClose = () => {
        closeModal('shareFolder')
    }

    //هندل کردن کپی لینک
    const handleCopyLink = async () => {
        try {
            setIsLoading(true);
            await navigator.clipboard.writeText(shareLink);
            alert('لینک کپی شد')
        } catch (error) {
            console.error('خطا در کپی کردن :', error);
            alert('خطا در کپی کردن لینک')
        } finally {
            setIsLoading(false);
        }
    }

    //هندل کردن اشتراک گذاری فولدر
    const handleShareFolder = async () => {
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
                    Permissions: 'view',
                })
            });

            if (response.ok) {
                // success
                alert('فولدر با موفقیت به اشتراک گذاشته شد')
                handleClose();
            } else {
                throw new Error('خطا در اشتراک گذاری');
            }
        } catch (error) {
            console.error('خطا در اشتراک گذاری', error);
            alert('خطا در اشتراک‌گذاری فولدر');
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
                        <h2 className="text-medium-18 ">Share folder “Design File”</h2>
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
                <form className="flex flex-col items-start gap-6 self-stretch">

                    <div
                        className='flex items-center h-8 gap-2 px-3 py-2 rounded-lg border border-primary-500 bg-white shadow-[0_0_4px_0_rgba(76,60,198,0.16)] self-stretch'
                    >

                        <SearchIcon />
                        <div className="w-[1px] h-4 bg-[#A1A1A3]/50"></div>
                        <input
                            disabled={isLoading}
                            type="text"
                            className='w-full h-full text-sm bg-transparent outline-none placeholder-regular-12-manrope'
                            placeholder='Invite people...'
                        />
                    </div>

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
                            )
                            }
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
                            className='flex justify-center items-center w-8 h-8  gap-1 rounded-lg border border-[#ECECEE] bg-white shadow-light'>
                            <SettingsIcon />
                        </button>
                        <button
                            type='button'
                            onClick={handleShareFolder}
                            disabled={isLoading}
                            className='flex justify-center items-center h-8 py-[13px] px-6 gap-2 rounded-lg border border-[#5749BF] bg-gradient-primary shadow-[0_4px_8px_0_rgba(0,0,0,0.16)] text-medium-14-white text-center'
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    sharing...
                                </>
                            ) : (
                                'Share folder'
                            )
                            }

                        </button>
                    </div>
                </form>
            </div>
        </BaseModal>
    )
}

export default ShareModal