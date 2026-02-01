import { useState } from 'react';
import useModalStore from '@/store/ui/modalStore';
import useFilesStore from '@/store/features/files/filesStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export const useFileActions = (file) => {
    const [isLoading, setIsLoading] = useState(false);
    const { openModal } = useModalStore();
    const { updateFile, removeFile } = useFilesStore();

    const handleShare = () => {
        openModal('shareFolder', {
            fileName: file.originalName || file.name,
            fileId: file.id,
            fileType: 'file'
        });
    };

    const handleCopyLink = async () => {
        try {
            const link = `${window.location.origin}/files/${file.id}`;
            await navigator.clipboard.writeText(link);
            showSuccessToast('Link copied to clipboard!');
        } catch (error) {
            showErrorToast('Failed to copy link');
        }
    };

    const handleDownload = async () => {
        try {
            const link = document.createElement('a');
            link.href = file.secureUrl || file.url;
            link.download = file.originalName || file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showSuccessToast('Download started!');
        } catch (error) {
            showErrorToast('Failed to download file');
        }
    };

    const handleToggleStar = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/files/${file.id}/star`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ isStarred: !file.isStarred })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update star status');
            }

            const data = await response.json();
            updateFile(file.id, { isStarred: data.file.isStarred });
            showSuccessToast(data.file.isStarred ? 'File starred!' : 'File unstarred!');
        } catch (error) {
            showErrorToast(error.message || 'Failed to update star status');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRename = () => {
        openModal('renameFile', {
            fileName: file.originalName || file.name,
            fileId: file.id
        });
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/files/${file.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete file');
            }

            removeFile(file.id);
            showSuccessToast('File moved to trash');
        } catch (error) {
            showErrorToast(error.message || 'Failed to delete file');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        handleShare,
        handleCopyLink,
        handleDownload,
        handleToggleStar,
        handleRename,
        handleDelete,
    };
};