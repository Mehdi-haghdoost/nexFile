import { TrashIcon } from '@/components/ui/icons'
import React from 'react'

const EmptyDeletedFiles = () => {
    return (
        <div className='flex flex-1 flex-col items-center justify-center gap-4 self-stretch'>
            {/* Logomark/Icon */}
            <div className='flex items-center justify-center w-16 h-16 rounded-full bg-gray-100'>
                <TrashIcon />
            </div>

            {/* Message */}
            <div className='flex flex-col items-center gap-1'>
                <h3 className='text-medium-16 text-neutral-900'>No files are currently deleted</h3>
                <p className='text-regular-14 text-neutral-500 text-center'>
                    Deleted files will appear here
                </p>
            </div>
        </div>
    )
}

export default EmptyDeletedFiles