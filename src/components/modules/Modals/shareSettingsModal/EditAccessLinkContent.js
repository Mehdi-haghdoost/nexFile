import React from 'react'

const EditAccessLinkContent = ({ onLinkCreated }) => {
    
    const handleCreateLink = () => {
        // اینجا API call برای ساخت لینک
        // بعد از موفقیت:
        onLinkCreated();
    };

    return (
        <div className='flex flex-col items-center justify-center h-[200px] p-4 gap-4 self-stretch rounded-lg border border-[#E1E0E5] bg-white dark:bg-neutral-600'>
            <h2 className='text-medium-16 dark:text-medium-16-white'>A link for editing does not exist</h2>
            <button 
                onClick={handleCreateLink}
                className='flex h-8 items-center justify-center gap-2 rounded-lg border border-[#5749BF] bg-gradient-primary py-[13px] px-6 text-center text-medium-14-white shadow-heavy'
            >
                Create link
            </button>
        </div>
    )
}

export default EditAccessLinkContent