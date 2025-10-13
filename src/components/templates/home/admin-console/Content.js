// src/components/templates/home/admin-console/Content.js
import React from 'react';
import { ADMIN_SECTIONS } from '@/utils/constants/adminConstants';
// Import separated content components
import DashboardContent from './sections/DashboardContent';
import MembersContent from './sections/MembersContent';
import GroupsContent from './sections/GroupsContent';
import ContentManagementContent from './sections/ContentManagementContent';
import SecurityContent from './sections/SecurityContent';
import BillingContent from './sections/BillingContent';
import SettingsContent from './sections/SettingsContent';

const Content = ({ activeSection }) => {
    const renderContent = () => {
        switch (activeSection) {
            case ADMIN_SECTIONS.DASHBOARD:
                return <DashboardContent />;
            case ADMIN_SECTIONS.MEMBERS:
                return <MembersContent />;
            case ADMIN_SECTIONS.GROUPS:
                return <GroupsContent />;
            case ADMIN_SECTIONS.CONTENT:
                return <ContentManagementContent />;
            case ADMIN_SECTIONS.SECURITY:
                return <SecurityContent />;
            case ADMIN_SECTIONS.BILLING:
                return <BillingContent />;
            case ADMIN_SECTIONS.SETTINGS:
                return <SettingsContent />;
            default:
                // Default content when section is not recognized
                return <DashboardContent />; 
        }
    };

    return (
        <div>
            {renderContent()}
        </div>
    );
};

export default Content;