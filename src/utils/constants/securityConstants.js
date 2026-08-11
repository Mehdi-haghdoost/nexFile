// Definitions for the security settings list; values come from the API.
// scope decides which endpoint a change is sent to.
export const SECURITY_SETTINGS_SCHEMA = [
    {
        id: 'password',
        scope: 'personal',
        title: 'Password',
        description: 'Establish a distinctive password to safeguard your personal NexFile account',
        type: 'button',
        actionText: 'Set password'
    },
    {
        id: 'twoStepVerification',
        scope: 'personal',
        title: 'Two-step verification',
        description: 'You are required to enter a security key or code in conjunction with your password',
        type: 'switch'
    },
    {
        id: 'linkPassword',
        scope: 'organization',
        title: 'Link password',
        description: 'Add an extra layer of security by setting a password for your links',
        type: 'switch'
    },
    {
        id: 'linkExpiration',
        scope: 'organization',
        title: 'Link expiration',
        description: 'Set a time limit for your links with the "Link Expiration" feature',
        type: 'switch'
    },
    {
        id: 'externalSharing',
        scope: 'organization',
        title: 'External sharing',
        description: 'Share files or folders with users outside your organization',
        type: 'dropdown',
        options: ['Email and link', 'Email only', 'Link only', 'Disabled']
    }
];

export const MONITORING_TABS = [
    { id: 'activity', label: 'Activity' },
    { id: 'external-sharing', label: 'External sharing' }
];

// Categories used to filter the activity log
export const ACTIVITY_CATEGORIES = [
    { id: 'all', label: 'All activities' },
    { id: 'Members', label: 'Members' },
    { id: 'Groups', label: 'Groups' },
    { id: 'Security', label: 'Security' },
    { id: 'General', label: 'General' }
];

export const TWO_FACTOR_STEPS = {
    SCAN: 'scan',
    VERIFY: 'verify',
    BACKUP_CODES: 'backup-codes'
};