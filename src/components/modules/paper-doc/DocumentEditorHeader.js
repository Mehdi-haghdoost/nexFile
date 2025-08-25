import { BellIcon, FilePlus01, FolderIcon, SearchIcon, ShareIcon } from '@/components/ui/icons'
import React from 'react'

const DocumentEditorHeader = () => {
    return (
        <div className='flex items-center justify-between py-[18px] px-8 border-b border-[#F2F2F3] bg-white self-stretch'>
            <div className='flex flex-col justify-center items-start gap-0.5'>
                <h3 className='text-medium-16'>Daily Task</h3>
                <div className='flex items-center gap-1'>
                    <FolderIcon />
                    <p className='text-regular-12'>Campaign Design</p>
                </div>
            </div>
            <div className='flex items-start justify-center gap-4'>
                <div className='flex items-center gap-3'>
                    <img src="/images/nav_img.png" className='w-7 h-7 rounded-[28px] ' alt="" />
                    <button className='flex justify-center items-center gap-2.5 py-[13px] pr-4 pl-3 h-8 rounded-lg border border-[#5749BF] shadow-heavy bg-gradient-primary text-medium-14-white text-center'>
                        <ShareIcon />
                        Share
                    </button>
                    <button className='flex justify-center items-center gap-2.5 py-[13px] pr-4 pl-3 h-8 rounded-lg border border-[#ECECEE] bg-white shadow-light text-medium-14'>
                        <FilePlus01 />
                        New doc
                    </button>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="2" height="33" viewBox="0 0 2 33" fill="none">
                    <path d="M1 0.5V32.5" stroke="#F1F1F3" />
                </svg>
                <div className='flex items-center gap-3'>
                    <button className='btn-icon'>
                        <SearchIcon />
                    </button>
                    <div className='w-8 h-8'>
                        <button className='btn-icon relative'>
                            <BellIcon />
                        </button>
                        <svg className='absolute top-[31px] right-[43px]' xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 5 5" fill="none">
                            <circle cx="2.5" cy="2.5" r="2.5" fill="#BC1828" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DocumentEditorHeader