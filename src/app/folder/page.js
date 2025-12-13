'use client';

import FolderLayout from '@/components/layouts/Folder/FolderLayout';
import ActionButtons from '@/components/layouts/Home/ActionButtons';
import FileSection from '@/components/templates/home/allFolder/FileSection';
import SuggestedSection from '@/components/templates/home/allFolder/SuggestedSection';
import MoreDropdownPortal from '@/components/modules/home/actionDropdowns/MoreDropdownPortal';
import { actionButtonsConfig } from '@/components/layouts/Home/actionButtonsConfig';
import useModalStore from '@/store/ui/modalStore';
import useDropdownStore from '@/store/ui/dropdownStore';

const FolderPage = () => {
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
        <FolderLayout>
            <div className='relative flex py-4 px-4 md:py-6 md:px-8 flex-col items-start gap-4 md:gap-6 flex-1 self-stretch bg-white dark:bg-neutral-900 w-full'>
                <div className='w-full max-w-full'>
                    <ActionButtons activeSection="all-folders" />
                </div>
                <div className='w-full max-w-full'>
                    <SuggestedSection />
                </div>
                <div className='w-full max-w-full'>
                    <FileSection />
                </div>
                
                {/* Portal برای More Dropdown */}
                <MoreDropdownPortal 
                    buttons={hiddenButtons}
                    onItemClick={handleMoreItemClick}
                />
            </div>
        </FolderLayout>
    );
};

export default FolderPage;