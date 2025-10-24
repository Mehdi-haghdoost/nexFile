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

export const ACTIVITY_FILTERS = [
    { id: 'date', label: 'Date:', value: 'All', width: 'w-[180px]' },
    { id: 'activities', label: 'Activities', value: '', width: 'w-auto' },
    { id: 'people', label: 'People', value: '', width: 'w-auto' },
    { id: 'participants', label: 'Participants', value: '', width: 'w-auto' },
    { id: 'content', label: 'Content', value: '', width: 'w-auto' }
];

export const ACTIVITY_ACTIONS = [
    { id: 'export', label: 'Export', icon: 'UploadIcon', variant: 'secondary' },
    { id: 'clear', label: 'Clear', icon: 'WhiteTrashIcon', variant: 'danger' }
];

// اضافه کردن ACTIVITY_DATA که export شده بود
export const ACTIVITY_DATA = [
    {
        id: 1,
        date: '15/01/2025',
        location: 'Jakarta',
        time: '12:12 PM',
        activity: 'Added new members to the group',
        category: 'Groups',
        person: {
            name: 'Adrian Carter',
            avatar: '/images/adrian.png'
        }
    },
    {
        id: 2,
        date: '16/01/2025',
        location: 'America',
        time: '12:12 PM',
        activity: 'Changed group settings',
        category: 'Groups',
        person: {
            name: 'Adrian Carter',
            avatar: '/images/adrian.png'
        }
    },
    {
        id: 3,
        date: '17/01/2025',
        location: 'Sydney',
        time: '12:12 PM',
        activity: 'Updated group description',
        category: 'Groups',
        person: {
            name: 'Adrian Carter',
            avatar: '/images/adrian.png'
        }
    },
    {
        id: 4,
        date: '18/01/2025',
        location: 'Semarang',
        time: '12:12 PM',
        activity: 'Shared a file with the group',
        category: 'Groups',
        person: {
            name: 'Adrian Carter',
            avatar: '/images/adrian.png'
        }
    },
    {
        id: 5,
        date: '19/01/2025',
        location: 'California',
        time: '12:12 PM',
        activity: 'Granted admin rights to a member',
        category: 'Groups',
        person: {
            name: 'Adrian Carter',
            avatar: '/images/adrian.png'
        }
    }
];