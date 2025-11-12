'use client';

import FolderLayout from '@/components/layouts/Folder/FolderLayout';
import ActionButtons from '@/components/layouts/Home/ActionButtons';
import FileSection from '@/components/templates/home/allFolder/FileSection';
import SuggestedSection from '@/components/templates/home/allFolder/SuggestedSection';

const FolderPage = () => {
    return (
        <FolderLayout>
            <div className='flex py-6 px-8 flex-col items-start gap-6 flex-1 self-stretch bg-white dark:bg-neutral-900'>
                <ActionButtons activeSection="all-folders" />
                <SuggestedSection />
                <FileSection />
            </div>
        </FolderLayout>
    );
};

export default FolderPage;