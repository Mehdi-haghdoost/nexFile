'use client';

import FolderLayout from '@/components/layouts/Folder/FolderLayout';
import FolderBrowser from '@/components/templates/folder/FolderBrowser';

// The top level of the folder tree
const FolderPage = () => {
    return (
        <FolderLayout>
            <FolderBrowser folderId={null} />
        </FolderLayout>
    );
};

export default FolderPage;