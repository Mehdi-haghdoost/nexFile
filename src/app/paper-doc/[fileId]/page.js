"use client";
import FolderItem from '@/components/modules/Modals/CreateFileModal/FolderItem';
import { CodeIcon, CollapseSidebarIcon, FileIcon, FoldersIcon, HomeIcon, LinearIcon, ListIcon, ListNumbersIcon, PhotoIcon, SectionIcon, TableIcon, VideoIcon } from '@/components/ui/icons';
import { useFolders } from '@/hooks/createFileModal/useFolders';
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import Header from '@/components/layouts/Home/Header';
import { useRouter } from 'next/navigation';
import PaperDocSidebar from '@/components/modules/paper-doc/PaperDocSidebar';
import DocumentEditor from '@/components/modules/paper-doc/DocumentEditor';
import DocumentEditorHeader from '@/components/modules/paper-doc/DocumentEditorHeader';
import useModalStore from '@/store/modalStore';
import ModalManager from '@/components/layouts/Modal/ModalManager';

const PaperDocPage = () => {

    const router = useRouter();
    const params = useParams();
    const { folders, isLoading } = useFolders();
    const { openModal } = useModalStore();

    // UI State
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [openedFolderId, setOpenedFolderId] = useState(1);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

    // Document State
    const [documentContent, setDocumentContent] = useState('');

    const fileId = params.fileId;

    useEffect(() => {
        if (folders && folders.length > 0 && !selectedFolder) {
            setSelectedFolder(folders[0]);
        }
    }, [folders, selectedFolder]);

    //  آپدیت تابع برای باز و بسته کردن فولدر
    const handleFolderSelect = (folder) => {
        setSelectedFolder(folder);
        setOpenedFolderId(prevId => (prevId === folder.id ? null : folder.id));
    };

    const handleBackToHome = () => {
        router.push('/home');
    };

    const handleCollapseSidebar = () => {
        setIsSidebarCollapsed(prev => !prev)
    };

    const handleContentChange = (newContent) => {
        setDocumentContent(newContent);
    };

    const handleShare = () => {
        const shareData = {
            documentTitle: 'Daily Task',
            folderName: selectedFolder ? selectedFolder.name : ''
        };
        openModal('shareFolder', shareData);
    };


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-regular-16">Loading document...</p>
            </div>
        )
    }

    return (
        <div className='flex overflow-hidden h-screen'>
            <PaperDocSidebar
                folders={folders}
                selectedFolder={selectedFolder}
                openedFolderId={openedFolderId}
                onFolderSelect={handleFolderSelect}
                onBackToHome={handleBackToHome}
                onCollapseSidebar={handleCollapseSidebar}
                isCollapsed={isSidebarCollapsed}
            />

            <div className="flex flex-col flex-1">
                <DocumentEditorHeader
                    selectedFolder={selectedFolder}
                    onShareClick={handleShare}
                />
                <DocumentEditor
                    content={documentContent}
                    onContentChange={handleContentChange}
                />
            </div>
        </div>
    )
}

export default PaperDocPage