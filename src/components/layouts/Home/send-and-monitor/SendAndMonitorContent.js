import React, { useRef, useState } from 'react';
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

    // The monitor tab lives here so the insights card can switch the table to Transfers
    const [monitorTab, setMonitorTab] = useState('activity');
    const monitorRef = useRef(null);

    // Opens the Transfers tab and scrolls the table into view, instantly when reduced motion is preferred
    const handleSeeInsights = () => {
        setMonitorTab('transfers');

        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        monitorRef.current?.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start',
        });
    };
    
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
                <StartWithAnalytics onSeeInsights={handleSeeInsights} />
            </div>

            <div ref={monitorRef} className='w-full max-w-full overflow-x-auto scroll-mt-4'>
                <SendAndMonitor activeTab={monitorTab} onTabChange={setMonitorTab} />
            </div>

            {/* Portal for the overflow "More" dropdown */}
            <MoreDropdownPortal 
                buttons={hiddenButtons}
                onItemClick={handleMoreItemClick}
            />
        </main>
    );
};

export default SendAndMonitorContent;