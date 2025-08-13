import React from 'react'

const FileTableHeader = ({ isAllSelected = false, onSelectAll }) => {
    return (
        <div className='flex items-center h-10 py-[13px] px-5 gap-2 self-stretch bg-[#FCFCFC] border border-[#ECECEE]'>
            <input
                checked={isAllSelected}
                onChange={onSelectAll}
                type="checkbox"
                className="h-[18px] w-[18px] rounded-[4px] border-[#EAEAEB] text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
            />
            <ul className='flex flex-1 items-center gap-3 self-stretch'>
                <li className='flex items-center w-[300px] h-[22px] py-0 px-3 gap-3'>
                    <p className='text-regular-14'>Name</p>
                </li>
                <li className='flex items-center flex-1 py-0 px-3 gap-2 self-stretch'>
                    <p className='text-regular-14'>Shared By</p>
                </li>
                <li className='flex items-center w-[129px] py-0 px-3 gap-2 self-stretch'>
                    <p className='text-regular-14'>File Size</p>
                </li>
                <li className='flex items-center w-[171px] py-0 px-3 gap-2 self-stretch'>
                    <p className='text-regular-14'>Last Modified</p>
                </li>
                <li className='flex items-center justify-center w-[52px] py-0 px-3 self-stretch'>
                    <p className='text-regular-14'>Action</p>
                </li>
            </ul>
        </div>
    )
}

export default FileTableHeader