import FileSection from '@/components/templates/home/allFolder/FileSection'
import FolderSection from '@/components/templates/home/allFolder/FolderSection'
import SuggestedSection from '@/components/templates/home/allFolder/SuggestedSection'
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