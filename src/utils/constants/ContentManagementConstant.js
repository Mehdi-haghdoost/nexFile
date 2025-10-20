export const CONTENT_MANAGEMENT_MOCK_DATA = [
    {
        id: 1,
        name: 'Adrian Carter',
        avatar: '/images/adrian.png',
        role: 'Admin',
        storageUsage: '50 MB',
        lastModified: '15/01/2025',
        folder: 'Campaign Design',
    },
    {
        id: 2,
        name: 'Bella Thompson',
        avatar: '/images/bella.png',
        role: 'Member',
        storageUsage: '32 MB',
        lastModified: '22/12/2024',
        folder: 'Illustrator Design',
    },
    {
        id: 3,
        name: 'Daniel Foster',
        avatar: '/images/daniel.png',
        role: 'Manager',
        storageUsage: '45 MB',
        lastModified: '08/11/2024',
        folder: 'Canva Design',
    }
];

export const CONTENT_MANAGEMENT_TABS = [
    { id: 'shared-folder', label: 'Shared folder' },
    { id: 'team-folder', label: 'Team folder' },
    { id: 'archived', label: 'Archived' },
    { id: 'locked-files', label: 'Locked files' },
    { id: 'member-access', label: 'Member access' },
];



export const CONTENT_MANAGEMENT_QUICK_ACTIONS = [
    {
        id: 'licenses',
        icon: 'LicensesIcon',
        label: 'Manage licenses'
    },
    {
        id: 'settings',
        icon: 'SettingIcon',
        label: 'Settings'
    }
];