'use client';

import AllFoldersContent from '@/components/layouts/Home/all-folders/AllFoldersContent';
import HomeLayout from '@/components/layouts/Home/HomeLayout'
import styles from '@/styles/home/home.module.css';
import { useState } from 'react';

const Home = () => {

    const [activeSection, setActiveSection] = useState('all-folders')
    const renderContent = () => {
        switch (activeSection) {
            case 'all-folders':
                return <AllFoldersContent/>
            case 'signatures':
                return <SignaturesContent />
            case 'send-and-monitor':
                return <SendAndMonitorContent />
            case 'shared':
                return <SharedContent />
            case 'file-requests':
                return <FileRequestsContent />
            case 'deleted-files':
                return <DeletedFilesContent />
            case 'admin-console':
                return <AdminConsoleContent />
            default:
                return <AllFoldersContent />

        }
    }

    return (
        <HomeLayout onSidebarChange={setActiveSection}>
            {renderContent()}
        </HomeLayout>
    )
}

export default Home;