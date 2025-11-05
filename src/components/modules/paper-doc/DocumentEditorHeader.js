import { BellIcon, FilePlus01, FolderIcon, SearchIcon, ShareIcon } from '@/components/ui/icons'
import React from 'react'

const DocumentEditorHeader = ({ selectedFolder, onShareClick }) => {
    return (
        <div className='flex items-center justify-between py-[18px] px-8 border-b border-[#F2F2F3] dark:border-neutral-800 bg-white dark:bg-neutral-900 self-stretch'>
            <div className='flex flex-col justify-center items-start gap-0.5'>
                <h3 className='text-medium-16 dark:text-medium-16-white'>Daily Task</h3>
                <div className='flex items-center gap-1'>
                    <FolderIcon />
                    <h2 className='dark:text-regular-12-neutral-300'>{selectedFolder ? selectedFolder.name : 'No folder selected'}</h2>
                </div>
            </div>
            <div className='flex items-start justify-center gap-4'>
                <div className='flex items-center gap-3'>
                    <img src="/images/nav_img.png" className='w-7 h-7 rounded-[28px] ' alt="" />
                    <button
                        onClick={onShareClick}
                        className='flex justify-center items-center gap-2.5 py-[13px] pr-4 pl-3 h-8 rounded-lg border border-[#5749BF] shadow-heavy bg-gradient-primary text-medium-14-white text-center'>
                        <ShareIcon />
                        Share
                    </button>
                    <button className='flex justify-center items-center gap-2.5 py-[13px] pr-4 pl-3 h-8 rounded-lg border border-[#ECECEE] bg-white dark:bg-dark-gradient dark:border-dark-border shadow-light dark:shadow-dark-panel text-medium-14 dark:text-medium-14-white'>
                        <FilePlus01 />
                        New doc
                    </button>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="2" height="33" viewBox="0 0 2 33" fill="none">
                    <path d="M1 0.5V32.5" stroke="#F1F1F3"
                        className='dark:stroke-[#212127]'
                    />
                </svg>
                <div className='flex items-center gap-3'>
                    <button className='btn-icon dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel'>
                        <SearchIcon />
                    </button>
                    <div className='w-8 h-8'>
                        <button className='btn-icon relative dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel'>
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