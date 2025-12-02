import React from 'react';
import ActionButtons from '../ActionButtons';
import StartWithAnalytics from '@/components/templates/home/send-and-monitor/StartWithAnalytics';
import SendAndMonitor from '@/components/templates/home/send-and-monitor/SendAndMonitor';
import MoreDropdownPortal from '@/components/modules/home/actionDropdowns/MoreDropdownPortal';
import { actionButtonsConfig } from '../actionButtonsConfig';
import useModalStore from '@/store/ui/modalStore';
import useDropdownStore from '@/store/ui/dropdownStore';

const SendAndMonitorContent = () => {
    const { openModal } = useModalStore();
    const { setActiveActionDropdown } = useDropdownStore();
    
    const actionButtons = actionButtonsConfig['send-and-monitor'] || [];
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
        <main className='relative flex py-4 px-4 md:py-6 md:px-8 flex-col items-start gap-4 md:gap-6 self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800 h-full overflow-x-hidden'>
            <section aria-label="Action buttons" className='w-full max-w-full'>
                <ActionButtons activeSection="send-and-monitor" />
            </section>
            
            <div className='w-full max-w-full'>
                <StartWithAnalytics />
            </div>

            <div className='w-full max-w-full overflow-x-auto'>
                <SendAndMonitor />
            </div>

            {/* Portal برای More Dropdown */}
            <MoreDropdownPortal 
                buttons={hiddenButtons}
                onItemClick={handleMoreItemClick}
            />
        </main>
    );
};

export default SendAndMonitorContent;