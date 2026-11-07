import React from 'react';
import SendAndMonitor from '@/components/templates/home/send-and-monitor/SendAndMonitor';

// The section owns its heading, send action and links, so this only provides the page frame
const SendAndMonitorContent = () => {
    return (
        <main className='relative flex py-4 px-4 md:py-6 md:px-8 flex-col items-start gap-4 md:gap-6 self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800 h-full overflow-x-hidden'>
            <div className='w-full max-w-full overflow-x-auto'>
                <SendAndMonitor />
            </div>
        </main>
    );
};

export default SendAndMonitorContent;