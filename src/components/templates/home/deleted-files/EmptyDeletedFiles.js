import { TrashIcon } from '@/components/ui/icons'
import React from 'react'

const EmptyDeletedFiles = () => {
    return (
        <div className='flex flex-1 flex-col items-center justify-center gap-6 self-stretch'>
            {/* Logomark/Icon with hover animations on parent div */}
            <div className='flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-neutral-800 
                transition-all duration-500 ease-out 
                hover:scale-110 
                hover:bg-gray-200 dark:hover:bg-neutral-700
                hover:shadow-lg
                hover:-translate-y-2
                cursor-pointer'>
                <TrashIcon />
            </div>

            {/* Message - بدون انیمیشن */}
            <div className='flex flex-col items-center gap-2'>
                <h3 className='text-medium-16 text-neutral-900 dark:text-medium-16-white'>
                    No files are currently deleted
                </h3>
                <p className='text-regular-14 text-neutral-500 text-center dark:text-regular-14-white'>
                    Deleted files will appear here
                </p>
            </div>
        </div>
    )
}

export default EmptyDeletedFiles