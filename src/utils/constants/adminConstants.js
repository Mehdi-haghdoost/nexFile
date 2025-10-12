import { 
    BillingIcon, 
    ContentIcon, 
    GroupIcon, 
    MembersIcon, 
    OverviewsIcon, 
    SecurityIcon, 
    SettingsIcon 
} from '@/components/ui/icons';

export const ADMIN_SECTIONS = {
    DASHBOARD: 'Dashboard',
    MEMBERS: 'Members',
    GROUPS: 'Groups',
    CONTENT: 'Content',
    SECURITY: 'Security',
    BILLING: 'Billing',
    SETTINGS: 'Settings'
};

export const adminMenuItems = [
    { id: ADMIN_SECTIONS.DASHBOARD, label: 'Dashboard', icon: OverviewsIcon },
    { id: ADMIN_SECTIONS.MEMBERS, label: 'Members', icon: MembersIcon },
    { id: ADMIN_SECTIONS.GROUPS, label: 'Groups', icon: GroupIcon },
    { id: ADMIN_SECTIONS.CONTENT, label: 'Content', icon: ContentIcon },
    { id: ADMIN_SECTIONS.SECURITY, label: 'Security', icon: SecurityIcon },
    { id: ADMIN_SECTIONS.BILLING, label: 'Billing', icon: BillingIcon },
    { id: ADMIN_SECTIONS.SETTINGS, label: 'Settings', icon: SettingsIcon },
];