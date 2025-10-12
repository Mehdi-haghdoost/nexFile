import React from 'react';
import { ADMIN_SECTIONS } from '@/utils/constants/adminConstants';

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
                return <DashboardContent />;
        }
    };

    return (
        <div className='flex-1 p-8'>
            {renderContent()}
        </div>
    );
};

// Dashboard Section
const DashboardContent = () => (
    <div className='space-y-4'>
        <h3 className='text-semibold-18'>Dashboard Overview</h3>
        <p className='text-regular-14 text-neutral-400'>
            Welcome to the admin dashboard. Monitor your system performance and activities.
        </p>
    </div>
);

// Members Section
const MembersContent = () => (
    <div className='space-y-4'>
        <h3 className='text-semibold-18'>Team Members</h3>
        <p className='text-regular-14 text-neutral-400'>
            Manage team members, assign roles, and control access permissions.
        </p>
    </div>
);

// Groups Section
const GroupsContent = () => (
    <div className='space-y-4'>
        <h3 className='text-semibold-18'>Groups Management</h3>
        <p className='text-regular-14 text-neutral-400'>
            Create and organize user groups for better collaboration.
        </p>
    </div>
);

// Content Management Section
const ContentManagementContent = () => (
    <div className='space-y-4'>
        <h3 className='text-semibold-18'>Content Management</h3>
        <p className='text-regular-14 text-neutral-400'>
            Manage files, folders, and shared content across your organization.
        </p>
    </div>
);

// Security Section
const SecurityContent = () => (
    <div className='space-y-4'>
        <h3 className='text-semibold-18'>Security Settings</h3>
        <p className='text-regular-14 text-neutral-400'>
            Configure security policies, authentication, and access controls.
        </p>
    </div>
);

// Billing Section
const BillingContent = () => (
    <div className='space-y-4'>
        <h3 className='text-semibold-18'>Billing & Payments</h3>
        <p className='text-regular-14 text-neutral-400'>
            View subscription details, invoices, and payment methods.
        </p>
    </div>
);

// Settings Section
const SettingsContent = () => (
    <div className='space-y-4'>
        <h3 className='text-semibold-18'>General Settings</h3>
        <p className='text-regular-14 text-neutral-400'>
            Customize application preferences and system configurations.
        </p>
    </div>
);

export default Content;