"use client";

import Link from 'next/link';
import FolderSection from '@/components/templates/home/allFolder/FolderSection';
import FileSection from '@/components/templates/home/allFolder/FileSection';
import ActionButtons from '@/components/layouts/Home/ActionButtons';
import MoreDropdownPortal from '@/components/modules/home/actionDropdowns/MoreDropdownPortal';
import FolderBreadcrumbs from './FolderBreadcrumbs';
import { actionButtonsConfig } from '@/components/layouts/Home/actionButtonsConfig';
import { useFolderDetails } from '@/hooks/folders/useFolderDetails';
import useModalStore from '@/store/ui/modalStore';
import useDropdownStore from '@/store/ui/dropdownStore';

const formatBytes = (bytes) => {
    if (!bytes || bytes <= 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

// folderId null is the root level, which /folder shows
const FolderBrowser = ({ folderId = null }) => {
    const { folder, path, isLoading, isNotFound, error } = useFolderDetails(folderId);
    const { openModal } = useModalStore();
    const { setActiveActionDropdown } = useDropdownStore();

    const actionButtons = actionButtonsConfig['all-folders'] || [];
    const hiddenButtons = actionButtons.slice(2);

    const handleMoreItemClick = (cardId) => {
        const clickedButton = actionButtons.find((button) => button.id === cardId);

        if (clickedButton?.modal) {
            openModal(clickedButton.modal);
        } else if (clickedButton?.dropdown) {
            setActiveActionDropdown(cardId);
        }
    };

    if (isNotFound || error) {
        return (
            <div className='flex flex-1 flex-col items-center justify-center gap-3 self-stretch py-20 text-center bg-white dark:bg-neutral-900 w-full'>
                <h1 className='text-base font-medium text-neutral-500 dark:text-white'>
                    {isNotFound ? 'Folder not found' : 'Could not load this folder'}
                </h1>
                <p className='text-sm text-neutral-300 dark:text-neutral-400'>
                    {isNotFound ? 'It may have been deleted, or the link is wrong.' : error}
                </p>
                <Link href='/folder' className='text-sm text-primary-500 hover:underline'>
                    Back to all folders
                </Link>
            </div>
        );
    }

    return (
        <div className='relative flex py-4 px-4 md:py-6 md:px-8 flex-col items-start gap-4 md:gap-6 flex-1 self-stretch bg-white dark:bg-neutral-900 w-full'>
            {/* The root level is already named by the sidebar, so only a folder gets a heading */}
            {folderId && (
                <div className='flex flex-col gap-2 w-full'>
                    <FolderBreadcrumbs path={path} />

                    {isLoading ? (
                        <div className='h-7 w-48 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse' />
                    ) : (
                        <div className='flex flex-wrap items-baseline gap-2'>
                            <h1 dir='auto' className='text-lg md:text-xl font-medium text-neutral-500 dark:text-white'>
                                {folder?.name}
                            </h1>
                            <span className='text-xs text-neutral-300 dark:text-neutral-400'>
                                {formatBytes(folder?.totalSize)}
                            </span>
                        </div>
                    )}
                </div>
            )}

            <div className='w-full max-w-full'>
                <ActionButtons activeSection="all-folders" />
            </div>

            <div className='w-full max-w-full'>
                <FolderSection
                    parentId={folderId}
                    title={folderId ? 'Subfolders' : 'Folders'}
                />
            </div>

            <div className='w-full max-w-full'>
                <FileSection folderId={folderId} />
            </div>

            <MoreDropdownPortal
                buttons={hiddenButtons}
                onItemClick={handleMoreItemClick}
            />
        </div>
    );
};

export default FolderBrowser;