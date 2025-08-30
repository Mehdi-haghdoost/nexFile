import React from 'react'

const EditAccessLinkContent = () => {
    return (
        <div className='flex flex-col items-center justify-center h-[200px] p-4 gap-4 self-stretch rounded-lg border border-[#E1E0E5] bg-white'>
            <h2 className='text-medium-16'>A link for editing does not exist</h2>
            <button className='flex h-8 items-center justify-center gap-2 rounded-lg border border-[#5749BF] bg-gradient-primary py-[13px] px-6 text-center text-medium-14-white shadow-heavy'>
                Create link
            </button>
        </div>
    )
}

export default EditAccessLinkContent