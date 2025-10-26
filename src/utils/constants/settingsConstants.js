export const SETTINGS_SECTIONS = [
    {
        id: 'account',
        title: 'Account',
        items: [
            {
                id: 'team-overview',
                title: 'Team overview',
                description: 'Customize your team by changing its name, selecting a language, adding a logo, and more.',
                icon: 'CustomizeIcon'
            },
            {
                id: 'early-preview',
                title: 'Early preview',
                description: 'Try out the latest features and share your feedback with the KeepCloud team.',
                icon: 'SettingIcon'
            }
        ]
    },
    {
        id: 'nexfile-product',
        title: 'NexFile product',
        items: [
            {
                id: 'replay',
                title: 'Replay',
                description: 'Allow members to review and approve videos, images, and audio.',
                icon: 'ReplayIcon'
            },
            {
                id: 'password',
                title: 'Password',
                description: 'Turn NexFiles Passwords on or off and track password health scores.',
                icon: 'PasswordPrimaryIcon'
            },
            {
                id: 'record',
                title: 'Record',
                description: 'Grant members access to the team space and enable caption generation.',
                icon: 'RecordIcon'
            },
            {
                id: 'send-monitor',
                title: 'Send and monitor',
                description: 'Share files securely and track how recipients view and interact with your content using Send and Track.',
                icon: 'TrackIcon'
            }
        ]
    }
];