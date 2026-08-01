export const MEMBER_TABS = [
    { id: 'active', label: 'Active' },
    { id: 'suggested', label: 'Suggested' },
    { id: 'guests', label: 'Guests' },
    { id: 'invited', label: 'Invited' },
    { id: 'suspended', label: 'Suspended' },
    { id: 'removed', label: 'Removed' }
];

export const MEMBER_ROLES = {
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    MEMBER: 'Member',
    GUEST: 'Guest'
};

export const MEMBER_PERMISSIONS = {
    CAN_EDIT: 'Can Edit',
    CAN_VIEW: 'Can View',
    NO_ACCESS: 'No Access'
};

export const QUICK_ACTIONS = [
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