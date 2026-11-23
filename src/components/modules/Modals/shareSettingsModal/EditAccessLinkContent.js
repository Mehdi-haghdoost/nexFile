import React from 'react'

// Public links are a later phase, so this tab only says they do not exist yet
const EditAccessLinkContent = () => {
    return (
        <div className='flex flex-col items-center justify-center h-[200px] p-4 gap-2 self-stretch rounded-lg border border-[#E1E0E5] bg-white dark:bg-neutral-600 text-center'>
            <h2 className='text-medium-16 dark:text-medium-16-white'>Public links aren't available yet</h2>
            <p className='text-regular-12-neutral-200 dark:text-regular-12-white'>
                For now, share with people directly. The in-app link opens only for people with access.
            </p>
        </div>
    )
}

export default EditAccessLinkContent