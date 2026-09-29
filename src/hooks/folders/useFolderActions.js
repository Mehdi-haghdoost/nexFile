"use client";

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/fetchWithAuth';
import { showConfirmDialog } from '@/lib/sweetAlert';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import useFoldersStore from '@/store/features/folders/foldersStore';
import useModalStore from '@/store/ui/modalStore';

// Rename, delete, move and copy for one folder, shared by the card and the menu
export const useFolderActions = () => {
    const router = useRouter();
    const { openModal } = useModalStore();
    const updateFolder = useFoldersStore((state) => state.updateFolder);
    const removeFolder = useFoldersStore((state) => state.removeFolder);

    const [busyId, setBusyId] = useState(null);

    const renameFolder = useCallback(async (folder, name) => {
        const trimmed = name.trim();

        // An unchanged or empty name is a cancelled edit, not a request
        if (!trimmed || trimmed === folder.name) return false;

        setBusyId(folder.id);

        try {
            const response = await api.patch(`/api/folders/${folder.id}`, { name: trimmed });
            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Failed to rename folder');
            }

            updateFolder(folder.id, { name: data.folder.name });
            return true;
        } catch (error) {
            console.error('Error renaming folder:', error);

            // A dead session already redirects to login inside fetchWithAuth
            if (error.message !== 'Session expired') {
                showErrorToast(error.message || 'Failed to rename folder');
            }
            return false;
        } finally {
            setBusyId(null);
        }
    }, [updateFolder]);

    const deleteFolder = useCallback(async (folder) => {
        if (busyId) return false;

        // The count comes from the card, so the warning names what is actually inside
        const contents = [];
        if (folder.subFoldersCount) contents.push(`${folder.subFoldersCount} subfolder${folder.subFoldersCount === 1 ? '' : 's'}`);
        if (folder.filesCount) contents.push(`${folder.filesCount} file${folder.filesCount === 1 ? '' : 's'}`);

        const confirmed = await showConfirmDialog({
            title: `Delete "${folder.name}"?`,
            text: contents.length
                ? `${contents.join(' and ')} inside will go to the trash too. You can restore them from there.`
                : 'It will go to the trash, where you can restore it.',
            confirmButtonText: 'Move to trash',
            cancelButtonText: 'Keep it',
        });

        if (!confirmed) return false;

        setBusyId(folder.id);

        try {
            const response = await api.delete(`/api/folders/${folder.id}`);
            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Failed to delete folder');
            }

            removeFolder(folder.id);
            showSuccessToast('Folder moved to trash');

            // Standing on the deleted folder's own page means leaving it
            if (window.location.pathname === `/folder/${folder.id}`) {
                router.push(folder.parentFolder ? `/folder/${folder.parentFolder}` : '/folder');
            }

            return true;
        } catch (error) {
            console.error('Error deleting folder:', error);

            if (error.message !== 'Session expired') {
                showErrorToast(error.message || 'Failed to delete folder');
            }
            return false;
        } finally {
            setBusyId(null);
        }
    }, [busyId, removeFolder, router]);

    const openMove = useCallback((folder) => openModal('move', folder), [openModal]);
    const openCopy = useCallback((folder) => openModal('copyFolder', folder), [openModal]);

    return { renameFolder, deleteFolder, openMove, openCopy, busyId };
};