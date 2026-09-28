'use client';

import { useParams } from 'next/navigation';
import FolderLayout from '@/components/layouts/Folder/FolderLayout';
import FolderBrowser from '@/components/templates/folder/FolderBrowser';

// One folder's subfolders and files
const FolderDetailPage = () => {
    const params = useParams();

    return (
        <FolderLayout>
            <FolderBrowser folderId={params?.id} />
        </FolderLayout>
    );
};

export default FolderDetailPage;