import { FileIcon } from '@/components/ui/icons'
import React from 'react'

const FileHeader = () => {
    return (
        <div className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200'>
            {/* Table header */}
            <div className='flex items-center gap-2 py-[13px] px-3 h-10 self-stretch border border-stroke-300 bg-stroke-100'>
                {/* Column labels */}
                <div className='flex flex-1 items-center gap-3 '>
                    <div className='flex items-center gap-2 w-[300px] h-[22px] py-0 px-3'>
                        <h3 className='text-regular-14'>Name</h3>
                    </div>
                    <div className='flex flex-1 items-center gap-2 self-stretch py-0 px-3'>
                        <h3 className='text-regular-14'>File name</h3>
                    </div>
                    <div className='flex items-center gap-2 w-[229px]  py-0 px-3'>
                        <h3 className='text-regular-14'>Duration</h3>
                    </div>
                    <div className='flex items-center gap-2 w-[118px]  py-0 px-3'>
                        <h3 className='text-regular-14'>Accessed</h3>
                    </div>
                </div>

            </div>
            {/* Table row */}
            <div className='flex items-center gap-2 self-stretch h-[52px] py-[13px] px-3'>
                <div className='flex flex-1 items-center gap-3'>
                    {/* Row cells */}
                    <div className='flex items-center gap-2 w-[300px] py-0 px-3 self-stretch'>
                        <img
                            className="w-6 h-6 flex-shrink-0 rounded-full bg-cover bg-center"
                            src="/images/adrian.png"
                            alt="User avatar"
                        />
                        <h3 className='text-medium-14'>Adrian Carter</h3>
                    </div>
                    <div className='flex flex-1 items-center gap-3 h-10 py-0 px-3'>
                        <FileIcon />
                        <h3 className='text-medium-14'>File.pdf</h3>
                    </div>
                    <div className='flex items-center gap-2 w-[229px] py-0 px-3 self-stretch'>
                        <h3 className='text-medium-14'>9m 32s</h3>
                    </div>
                    <div className='flex items-center gap-2 w-[118px] py-0 px-3 self-stretch'>
                        <h3 className='text-medium-14'>12h ago</h3>
                    </div>
                </div>
            </div>
            <div className='flex items-center gap-2 self-stretch h-[52px] py-[13px] px-3'>
                <div className='flex flex-1 items-center gap-3'></div>
            </div>
        </div>
    )
}

export default FileHeader