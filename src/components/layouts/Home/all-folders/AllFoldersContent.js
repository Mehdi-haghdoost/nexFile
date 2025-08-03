import FileSection from '@/components/templates/home/All folder/FileSection'
import FolderSection from '@/components/templates/home/All folder/FolderSection'
import SuggestedSection from '@/components/templates/home/All folder/SuggestedSection'
import React from 'react'
import ActionButtons from '../ActionButtons'

const AllFoldersContent = () => {
    return (
        <div className='flex py-6 px-8 flex-col items-start gap-6 flex-1 self-stretch bg-white'>
            <ActionButtons />
            <FolderSection />
            <SuggestedSection />
            <FileSection />
        </div>
    )
}

export default AllFoldersContent;