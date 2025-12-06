import { TrashIcon } from '@/components/ui/icons'
import React from 'react'

const EmptyDeletedFiles = () => {
    return (
        <div className='flex flex-1 flex-col items-center justify-center gap-4 sm:gap-6 self-stretch py-8 sm:py-12'>
            {/* Logomark/Icon with hover animations */}
            <div className='flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 dark:bg-neutral-800 
                transition-all duration-500 ease-out 
                hover:scale-110 
                hover:bg-gray-200 dark:hover:bg-neutral-700
                hover:shadow-lg
                hover:-translate-y-2
                cursor-pointer'>
                <TrashIcon />
            </div>

            {/* Message */}
            <div className='flex flex-col items-center gap-2 px-4'>
                <h3 className='text-sm sm:text-base font-medium text-neutral-900 dark:text-white'>
                    No files are currently deleted
                </h3>
                <p className='text-xs sm:text-sm text-neutral-500 dark:text-neutral-300 text-center'>
                    Deleted files will appear here
                </p>
            </div>
        </div>
    )
}

export default EmptyDeletedFiles