export const SECURITY_SETTINGS = [
    {
        id: 'password',
        title: 'Password',
        description: 'Establish a distinctive password to safeguard your personal KeepCloud account',
        type: 'button',
        actionText: 'Set password',
        status: null
    },
    {
        id: 'two-step-verification',
        title: 'Two-step verification',
        description: 'You are required to enter a security key or code in conjunction with your password',
        type: 'switch',
        status: true
    },
    {
        id: 'link-password',
        title: 'Link password',
        description: 'Add an extra layer of security by setting a password for your links',
        type: 'switch',
        status: false
    },
    {
        id: 'link-expiration',
        title: 'Link expiration',
        description: 'Set a time limit for your links with the "Link Expiration" feature',
        type: 'switch',
        status: false
    },
    {
        id: 'external-sharing',
        title: 'External sharing',
        description: 'Share files or folders with users outside your organization',
        type: 'dropdown',
        options: ['Email and link', 'Email only', 'Link only', 'Disabled'],
        currentOption: 'Email and link'
    }
];

export const MONITORING_TABS = [
    { id: 'activity', label: 'Activity' },
    { id: 'external-sharing', label: 'External sharing' }
];