import FileSection from '@/components/templates/home/allFolder/FileSection';
import FolderSection from '@/components/templates/home/allFolder/FolderSection';
import SuggestedSection from '@/components/templates/home/allFolder/SuggestedSection';
import React from 'react';
import ActionButtons from '../ActionButtons';
import MoreDropdownPortal from '@/components/modules/home/actionDropdowns/MoreDropdownPortal';
import { actionButtonsConfig } from '../actionButtonsConfig';
import useModalStore from '@/store/ui/modalStore';
import useDropdownStore from '@/store/ui/dropdownStore';

const AllFoldersContent = () => {
    const { openModal } = useModalStore();
    const { setActiveActionDropdown } = useDropdownStore();
    
    const actionButtons = actionButtonsConfig['all-folders'] || [];
    const hiddenButtons = actionButtons.slice(2);

    const handleMoreItemClick = (cardId) => {
        const clickedButton = actionButtons.find(button => button.id === cardId);
        
        if (clickedButton?.modal) {
            openModal(clickedButton.modal);
        } else if (clickedButton?.dropdown) {
            setActiveActionDropdown(cardId);
        }
    };

    return (
        <div className='relative flex py-4 px-4 md:py-6 md:px-8 flex-col items-start gap-4 md:gap-6 flex-1 self-stretch bg-white dark:bg-neutral-900'>
            <ActionButtons activeSection="all-folders" />
            <FolderSection />
            <SuggestedSection />
            <FileSection />
            
            {/* Portal برای More Dropdown */}
            <MoreDropdownPortal 
                buttons={hiddenButtons}
                onItemClick={handleMoreItemClick}
            />
        </div>
    );
};

export default AllFoldersContent;