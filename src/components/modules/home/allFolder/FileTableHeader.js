// import React from 'react'

// const FileTableHeader = ({ isAllSelected = false, onSelectAll }) => {
//     return (
//         <div className='flex items-center min-h-[40px] py-[13px] px-3 md:px-5 gap-2 self-stretch bg-[#FCFCFC] border-b border-[#ECECEE] dark:bg-neutral-800 dark:border-neutral-700'>
//             <input
//                 checked={isAllSelected}
//                 onChange={onSelectAll}
//                 type="checkbox"
//                 className="h-[18px] w-[18px] shrink-0 rounded-[4px] border-[#EAEAEB] text-blue-600 focus:ring-blue-500 focus:ring-offset-0 dark:invert dark:hue-rotate-180 dark:brightness-75 dark:accent-white"
//             />
//             <ul className='flex flex-1 items-center gap-2 md:gap-3 self-stretch overflow-hidden'>
//                 {/* Name - همیشه نمایش داده می‌شود */}
//                 <li className='flex items-center min-w-[120px] flex-1 md:w-[250px] xl:w-[300px] md:flex-initial py-0 px-2 md:px-3'>
//                     <p className='text-xs md:text-sm text-neutral-400 dark:text-neutral-300 truncate'>Name</p>
//                 </li>
                
//                 {/* Shared By - نمایش از 768px به بالا */}
//                 <li className='hidden md:flex items-center min-w-[100px] flex-1 xl:flex-initial xl:w-auto py-0 px-3'>
//                     <p className='text-sm text-neutral-400 dark:text-neutral-300'>Shared By</p>
//                 </li>
                
//                 {/* File Size - نمایش از 1280px به بالا */}
//                 <li className='hidden xl:flex items-center w-[129px] py-0 px-3'>
//                     <p className='text-sm text-neutral-400 dark:text-neutral-300'>File Size</p>
//                 </li>
                
//                 {/* Last Modified - نمایش از 1280px به بالا */}
//                 <li className='hidden xl:flex items-center w-[171px] py-0 px-3'>
//                     <p className='text-sm text-neutral-400 dark:text-neutral-300'>Last Modified</p>
//                 </li>
                
//                 {/* Action - همیشه نمایش داده می‌شود */}
//                 <li className='flex items-center justify-center w-[40px] md:w-[52px] shrink-0 py-0 px-2'>
//                     <p className='text-xs md:text-sm text-neutral-400 dark:text-neutral-300'>Act</p>
//                 </li>
//             </ul>
//         </div>
//     )
// }

// export default FileTableHeader

import React from 'react'

const FileTableHeader = ({ isAllSelected = false, onSelectAll }) => {
    return (
        <div className='flex items-center min-h-[40px] py-[13px] px-3 md:px-5 gap-2 self-stretch bg-[#FCFCFC] border-b border-[#ECECEE] dark:bg-neutral-800 dark:border-neutral-700'>
            <input
                checked={isAllSelected}
                onChange={onSelectAll}
                type="checkbox"
                className="h-[18px] w-[18px] shrink-0 rounded-[4px] border-[#EAEAEB] text-blue-600 focus:ring-blue-500 focus:ring-offset-0 dark:invert dark:hue-rotate-180 dark:brightness-75 dark:accent-white"
            />
            <ul className='flex flex-1 items-center gap-2 md:gap-3 self-stretch overflow-hidden'>
                {/* Name */}
                <li className='flex items-center min-w-[120px] flex-1 md:w-[250px] xl:w-[300px] md:flex-initial py-0 px-2 md:px-3'>
                    <p className='text-xs md:text-sm text-neutral-400 dark:text-neutral-300 truncate'>Name</p>
                </li>
                
                {/* Shared By */}
                <li className='hidden md:flex items-center flex-1 xl:flex-initial xl:w-[150px] py-0 px-3'>
                    <p className='text-sm text-neutral-400 dark:text-neutral-300'>Shared By</p>
                </li>
                
                {/* File Size */}
                <li className='hidden xl:flex items-center w-[150px] py-0 px-3 shrink-0'>
                    <p className='text-sm text-neutral-400 dark:text-neutral-300'>File Size</p>
                </li>
                
                {/* Last Modified */}
                <li className='hidden xl:flex items-center w-[200px] py-0 px-3 shrink-0'>
                    <p className='text-sm text-neutral-400 dark:text-neutral-300'>Last Modified</p>
                </li>
                
                {/* Action */}
                <li className='flex items-center justify-center w-[40px] md:w-[52px] shrink-0 py-0 px-2'>
                    <p className='text-xs md:text-sm text-neutral-400 dark:text-neutral-300'>Act</p>
                </li>
            </ul>
        </div>
    )
}

export default FileTableHeader