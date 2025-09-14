import SendAndMonitor from '@/components/templates/home/send-and-monitor/SendAndMonitor'
import StartWithAnalytics from '@/components/templates/home/send-and-monitor/StartWithAnalytics'
import React from 'react'
import ActionButtons from '../ActionButtons'

const SendAndMonitorContent = () => {
    return (
        <main className='flex py-6 px-8 flex-col items-start gap-6 self-stretch bg-white'>
            <section aria-label="Action buttons">
                <ActionButtons activeSection="send-and-monitor" />
            </section>
            
            <StartWithAnalytics />
            <SendAndMonitor />
        </main>
    )
}

export default SendAndMonitorContent