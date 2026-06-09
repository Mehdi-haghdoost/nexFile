"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFolders } from '@/hooks/files/createFileModal/useFolders';
import useModalStore from '@/store/ui/modalStore';
import PaperDocSidebar from '@/components/modules/paper-doc/PaperDocSidebar';
import DocumentEditor from '@/components/modules/paper-doc/DocumentEditor';
import DocumentEditorHeader from '@/components/modules/paper-doc/DocumentEditorHeader';

const PaperDocPage = () => {
    const router = useRouter();
    const params = useParams();
    const { folders = [], isLoading: foldersLoading } = useFolders();
    const { openModal } = useModalStore();

    const [selectedFolder, setSelectedFolder] = useState(null);
    const [openedFolderId, setOpenedFolderId] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Document state
    const [documentContent, setDocumentContent] = useState('');
    const [documentName, setDocumentName] = useState('Untitled');
    const [isFileLoading, setIsFileLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    const fileId = params?.fileId;
    const autoSaveTimer = useRef(null);
    const isInitialLoad = useRef(true);

    // Load file content when fileId changes
    useEffect(() => {
        if (!fileId) return;

        isInitialLoad.current = true;

        const loadFile = async () => {
            try {
                setIsFileLoading(true);
                const response = await fetch(`/api/files/paper/${fileId}`, {
                    credentials: 'include',
                });
                const data = await response.json();

                if (data.success) {
                    // ✅ Set content BEFORE turning off loading
                    // so textarea never shows empty white state
                    setDocumentContent(data.file.content || '');
                    setDocumentName(data.file.name || 'Untitled');
                    setLastSaved(null);
                }
            } catch (error) {
                console.error('Error loading file:', error);
            } finally {
                setIsFileLoading(false);
                setTimeout(() => { isInitialLoad.current = false; }, 100);
            }
        };

        loadFile();
    }, [fileId]);
    // Auto-save - only after initial load
    useEffect(() => {
        if (!fileId || isFileLoading || isInitialLoad.current) return;

        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

        autoSaveTimer.current = setTimeout(async () => {
            try {
                setIsSaving(true);
                const response = await fetch(`/api/files/paper/${fileId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        content: documentContent,
                        name: documentName,
                    }),
                });
                const data = await response.json();
                if (data.success) setLastSaved(new Date());
            } catch (error) {
                console.error('Error saving file:', error);
            } finally {
                setIsSaving(false);
            }
        }, 2000);

        return () => {
            if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        };
    }, [documentContent, documentName, fileId]);

    // Set default folder
    useEffect(() => {
        if (!folders?.length || selectedFolder) return;
        setSelectedFolder(folders[0]);
        setOpenedFolderId(folders[0]?.id || null);
    }, [folders]);

    const handleNewDoc = useCallback(async (folder) => {
        try {
            const response = await fetch('/api/files/paper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: 'Untitled Document',
                    folderId: folder?.id || null,
                }),
            });
            const data = await response.json();
            if (data.success) {
                router.push(`/paper-doc/${data.file.id}`);
            }
        } catch (error) {
            console.error('Error creating new doc:', error);
        }
    }, [router]);

    const handleFolderSelect = useCallback((folder) => {
        if (!folder) return;
        setSelectedFolder(folder);
        setOpenedFolderId(prev => prev === folder.id ? null : folder.id);
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setIsMobileSidebarOpen(false);
        }
    }, []);

    const handleBackToHome = useCallback(() => router.push('/home'), [router]);
    const handleCollapseSidebar = useCallback(() => setIsSidebarCollapsed(prev => !prev), []);
    const handleToggleMobileSidebar = useCallback(() => {
        setIsMobileSidebarOpen(prev => !prev);
        if (!isMobileSidebarOpen) setIsSidebarCollapsed(false);
    }, [isMobileSidebarOpen]);
    const handleCloseMobileSidebar = useCallback(() => setIsMobileSidebarOpen(false), []);
    const handleShare = useCallback(() => openModal('shareFolder', {
        documentTitle: documentName,
        folderName: selectedFolder?.name || '',
        fileId,
    }), [documentName, selectedFolder, fileId]);

    return (
        <div className="flex h-screen overflow-hidden h-full">
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={handleCloseMobileSidebar}
                />
            )}

            <div className={`
                fixed inset-y-0 left-0 z-50
                transform transition-transform duration-300 ease-in-out
                lg:relative lg:z-0
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <PaperDocSidebar
                    folders={folders}
                    selectedFolder={selectedFolder}
                    openedFolderId={openedFolderId}
                    onFolderSelect={handleFolderSelect}
                    onBackToHome={handleBackToHome}
                    onCollapseSidebar={handleCollapseSidebar}
                    onCloseMobile={handleCloseMobileSidebar}
                    isCollapsed={isSidebarCollapsed}
                    currentFileId={fileId}
                    onNewDoc={handleNewDoc}
                />
            </div>

            {/* <div className="flex flex-1 flex-col overflow-hidden">
                <DocumentEditorHeader
                    selectedFolder={selectedFolder}
                    documentName={documentName}
                    onDocumentNameChange={setDocumentName}
                    onShareClick={handleShare}
                    onToggleSidebar={handleToggleMobileSidebar}
                    isSaving={isSaving}
                    lastSaved={lastSaved}
                />

                {isFileLoading ? (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <DocumentEditor
                        content={documentContent}
                        onContentChange={setDocumentContent}
                    />
                )}
            </div> */}

            <div className="flex flex-1 flex-col overflow-hidden relative h-full">
                <DocumentEditorHeader
                    selectedFolder={selectedFolder}
                    documentName={documentName}
                    onDocumentNameChange={setDocumentName}
                    onShareClick={handleShare}
                    onToggleSidebar={handleToggleMobileSidebar}
                    isSaving={isSaving}
                    lastSaved={lastSaved}
                />

                {/* ✅ Editor always visible, spinner overlays on top */}
                <div className="relative flex-1 overflow-hidden h-full">
                    <DocumentEditor
                        content={documentContent}
                        onContentChange={setDocumentContent}
                    />

                    {isFileLoading && (
                        <div className="absolute inset-0 bg-white/70 dark:bg-neutral-900/70 flex items-center justify-center z-10">
                            <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaperDocPage;