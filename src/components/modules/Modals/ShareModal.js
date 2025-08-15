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


    const isOpen = modals.shareFolder?.isOpen || false;
    const data = modals.shareFolder?.data || null;

    const handleClose = () => {
        closeModal('shareFolder')
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
                            type="text"
                            className='w-full h-full text-sm bg-transparent outline-none placeholder-regular-12-manrope'
                            placeholder='Invite people...'
                        />
                    </div>

                    <div className='flex justify-center items-center h-12 py-3 px-4 gap-2 self-stretch rounded-lg border border-[#E1E0E5] bg-white'>
                        <p className='truncate flex-1 text-regular-14-manrope'>
                            https://keepcloud.com/folders/0B8MXxVL7sSStfjlBVnhQUk92SGVpSGl3WmFCQVMySE5EbGllOE9BU2hZeFk3SFhaQV9XWWc?resourcekey=0-UX80l5-84OSFv0QHOw4ejw&usp=sharing
                        </p>
                        <CopyIcon />
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
                        <button className='flex justify-center items-center w-8 h-8  gap-1 rounded-lg border border-[#ECECEE] bg-white shadow-light'>
                            <SettingsIcon />
                        </button>
                        <button className='flex justify-center items-center h-8 py-[13px] px-6 gap-2 rounded-lg border border-[#5749BF] bg-gradient-primary shadow-[0_4px_8px_0_rgba(0,0,0,0.16)] text-medium-14-white text-center'>
                            Share folder
                        </button>
                    </div>
                </form>
            </div>
        </BaseModal>
    )
}

export default ShareModal