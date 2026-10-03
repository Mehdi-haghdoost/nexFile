"use client";

import Link from 'next/link';
import FolderSection from '@/components/templates/home/allFolder/FolderSection';
import FileSection from '@/components/templates/home/allFolder/FileSection';
import ActionButtons from '@/components/layouts/Home/ActionButtons';
import MoreDropdownPortal from '@/components/modules/home/actionDropdowns/MoreDropdownPortal';
import FolderPageHeader from './FolderPageHeader';
import { actionButtonsConfig } from '@/components/layouts/Home/actionButtonsConfig';
import { useFolderDetails } from '@/hooks/folders/useFolderDetails';
import useModalStore from '@/store/ui/modalStore';
import useDropdownStore from '@/store/ui/dropdownStore';

// folderId null is the root level, which /folder shows
const FolderBrowser = ({ folderId = null }) => {
    const { folder, path, isLoading, isNotFound, error, applyUpdate } = useFolderDetails(folderId);
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
            <div className='flex flex-1 flex-col items-center justify-center gap-3 self-stretch py-20 text-center bg-white dark:bg-neutral-900 w-full h-full'>
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

    // Files inside a folder are headed by that folder's name
    const fileSectionTitle = folderId ? `Files in ${folder?.name || ''}` : 'Your files';

    return (
        <div className='relative flex py-4 px-4 md:py-6 md:px-8 flex-col items-start gap-4 md:gap-6 flex-1 self-stretch bg-white dark:bg-neutral-900 w-full h-full'>
            {/* The root level is already named by the sidebar, so only a folder gets a heading */}
            {folderId && (
                <FolderPageHeader
                    folder={folder}
                    path={path}
                    isLoading={isLoading}
                    onRenamed={(name) => applyUpdate({ name })}
                />
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
                <FileSection folderId={folderId} title={fileSectionTitle} />
            </div>

            <MoreDropdownPortal
                buttons={hiddenButtons}
                onItemClick={handleMoreItemClick}
            />
        </div>
    );
};

export default FolderBrowser;