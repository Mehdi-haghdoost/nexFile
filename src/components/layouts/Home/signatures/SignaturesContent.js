import SignaturesList from '@/components/templates/home/signatures/SignaturesList'
import StartFromSignature from '@/components/templates/home/signatures/StartFromSignature'
import React from 'react'
import ActionButtons from '../ActionButtons'
import MoreDropdownPortal from '@/components/modules/home/actionDropdowns/MoreDropdownPortal'
import { actionButtonsConfig } from '../actionButtonsConfig'
import useModalStore from '@/store/ui/modalStore'
import useDropdownStore from '@/store/ui/dropdownStore'

const SignaturesContent = () => {
    const { openModal } = useModalStore();
    const { setActiveActionDropdown } = useDropdownStore();
    
    const actionButtons = actionButtonsConfig['signatures'] || [];
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
        <div className='relative flex py-4 px-4 md:py-6 md:px-8 flex-col items-start gap-4 md:gap-6 flex-1 self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800 overflow-x-hidden'>
            <div className='w-full max-w-full'>
                <ActionButtons activeSection="signatures" />
            </div>
            
            {/* Start from the signature */}
            <div className='w-full max-w-full'>
                <StartFromSignature />
            </div>
            
            {/* Signatures List */}
            <div className='w-full max-w-full'>
                <SignaturesList />
            </div>
            
            {/* Portal برای More Dropdown */}
            <MoreDropdownPortal 
                buttons={hiddenButtons}
                onItemClick={handleMoreItemClick}
            />
        </div>
    )
}

export default SignaturesContent;