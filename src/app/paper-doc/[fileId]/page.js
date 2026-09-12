"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFolders } from '@/hooks/files/createFileModal/useFolders';
import { useCreatePaperDoc } from '@/hooks/paper-doc/useCreatePaperDoc';
import { useDeletePaperDoc } from '@/hooks/paper-doc/useDeletePaperDoc';
import { useDeletedPaperDocs } from '@/hooks/paper-doc/useDeletedPaperDocs';
import useModalStore from '@/store/ui/modalStore';
import PaperDocSidebar from '@/components/modules/paper-doc/PaperDocSidebar';
import DocumentEditor from '@/components/modules/paper-doc/DocumentEditor';
import DocumentEditorHeader from '@/components/modules/paper-doc/DocumentEditorHeader';

// The File model stores the folder as an ObjectId under "folder"
// The API may send it back as folderId, as folder, or as a populated object
const readFolderId = (file) => {
    const reference = file?.folderId ?? file?.folder ?? null;
    if (!reference) return null;
    if (typeof reference === 'object') return String(reference._id || reference.id || '');
    return String(reference);
};

const PaperDocPage = () => {
    const router = useRouter();
    const params = useParams();
    const { folders = [] } = useFolders();
    const { openModal } = useModalStore();

    const [selectedFolder, setSelectedFolder] = useState(null);
    const [openedFolderId, setOpenedFolderId] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Document state
    const [documentContent, setDocumentContent] = useState('');
    const [documentName, setDocumentName] = useState('Untitled');
    const [fileFolderId, setFileFolderId] = useState(null);
    const [isFileLoading, setIsFileLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    // Bumped after a create, delete or restore so the sidebar refetches its lists
    const [filesVersion, setFilesVersion] = useState(0);

    const fileId = params?.fileId;
    const autoSaveTimer = useRef(null);
    const isInitialLoad = useRef(true);

    // Blocks the pending autosave once the open document has been deleted
    const isDeleted = useRef(false);

    const bumpFilesVersion = useCallback(() => {
        setFilesVersion((prev) => prev + 1);
    }, []);

    // Leaves the deleted document behind, preferring another doc in the same folder
    const handleDocDeleted = useCallback((file, folder, nextFileId) => {
        bumpFilesVersion();

        if (file.id !== fileId) return;

        isDeleted.current = true;
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

        router.push(nextFileId ? `/paper-doc/${nextFileId}` : '/home');
    }, [bumpFilesVersion, fileId, router]);

    const { createDoc, isCreating } = useCreatePaperDoc({ onCreated: bumpFilesVersion });
    const { deleteDoc, deletingId } = useDeletePaperDoc({ onDeleted: handleDocDeleted });

    const {
        docs: deletedDocs,
        isLoading: isLoadingDeleted,
        busyId: busyDeletedId,
        loadDeleted,
        restoreDoc,
        destroyDoc,
    } = useDeletedPaperDocs({ onRestored: bumpFilesVersion });

    // Load file content when fileId changes
    useEffect(() => {
        if (!fileId) return;

        isInitialLoad.current = true;
        isDeleted.current = false;

        const loadFile = async () => {
            try {
                setIsFileLoading(true);
                const response = await fetch(`/api/files/paper/${fileId}`, {
                    credentials: 'include',
                });
                const data = await response.json();

                if (data.success) {
                    // Set content before turning off loading so the textarea never flashes empty
                    setDocumentContent(data.file.content || '');
                    setDocumentName(data.file.name || 'Untitled');
                    setFileFolderId(readFolderId(data.file));
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

    // Auto-save - only after initial load and never for a deleted document
    useEffect(() => {
        if (!fileId || isFileLoading || isInitialLoad.current || isDeleted.current) return;

        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

        autoSaveTimer.current = setTimeout(async () => {
            if (isDeleted.current) return;

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

    // Keeps the selected folder aligned with the folder that owns the open file
    // Without this the header always showed the first folder and New doc created it there
    useEffect(() => {
        if (!folders.length) return;

        const owner = fileFolderId
            ? folders.find((folder) => String(folder.id) === fileFolderId)
            : null;
        const next = owner || selectedFolder || folders[0];

        if (next && next.id !== selectedFolder?.id) {
            setSelectedFolder(next);
            setOpenedFolderId(next.id);
        }
    }, [folders, fileFolderId]);

    // Creates a document in the given folder, falling back to the selected one
    const handleNewDoc = useCallback((folder) => {
        createDoc(folder || selectedFolder);
    }, [createDoc, selectedFolder]);

    // Deletes the given document, defaulting to the one currently open
    const handleDeleteDoc = useCallback((file, folder, nextFileId) => {
        const target = file || { id: fileId, name: documentName };
        deleteDoc(target, folder || selectedFolder, nextFileId);
    }, [deleteDoc, documentName, fileId, selectedFolder]);

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
                    onDeleteDoc={handleDeleteDoc}
                    isCreatingDoc={isCreating}
                    deletingFileId={deletingId}
                    filesVersion={filesVersion}
                    deletedDocs={deletedDocs}
                    isLoadingDeleted={isLoadingDeleted}
                    busyDeletedId={busyDeletedId}
                    onLoadDeleted={loadDeleted}
                    onRestoreDoc={restoreDoc}
                    onDestroyDoc={destroyDoc}
                />
            </div>

            <div className="flex flex-1 flex-col overflow-hidden relative h-full">
                <DocumentEditorHeader
                    selectedFolder={selectedFolder}
                    documentName={documentName}
                    onDocumentNameChange={setDocumentName}
                    onShareClick={handleShare}
                    onToggleSidebar={handleToggleMobileSidebar}
                    onNewDoc={handleNewDoc}
                    onDeleteDoc={handleDeleteDoc}
                    isCreatingDoc={isCreating}
                    isDeletingDoc={deletingId === fileId}
                    isSaving={isSaving}
                    lastSaved={lastSaved}
                />

                {/* Editor stays mounted, the spinner overlays it while the file loads */}
                <div className="relative flex-1 overflow-hidden h-full">
                    <DocumentEditor
                        content={documentContent}
                        onContentChange={setDocumentContent}
                        title={documentName}
                        onTitleChange={setDocumentName}
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