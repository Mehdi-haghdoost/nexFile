import FileSection from '@/components/templates/home/All folder/FileSection'
import FolderSection from '@/components/templates/home/All folder/FolderSection'
import SuggestedSection from '@/components/templates/home/All folder/SuggestedSection'
import React from 'react'

const AllFoldersContent = () => {
    return (
        <div>
            <FolderSection />
            <SuggestedSection />
            <FileSection />
        </div>
    )
}

export default AllFoldersContent;