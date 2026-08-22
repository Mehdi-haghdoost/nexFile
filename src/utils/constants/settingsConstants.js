// Feature flags stored under Organization.settings.features
export const SETTINGS_FEATURE_KEYS = [
    'earlyPreview',
    'replay',
    'password',
    'record',
    'sendAndMonitor'
];

export const SETTINGS_LANGUAGES = [
    { id: 'en', label: 'English' },
    { id: 'fa', label: 'Persian' },
    { id: 'de', label: 'German' },
    { id: 'fr', label: 'French' },
    { id: 'es', label: 'Spanish' }
];

export const DEFAULT_LANGUAGE = 'en';

export const MAX_TEAM_NAME_LENGTH = 150;

// type decides how the row renders: a toggle switch or a row that opens a modal
export const SETTINGS_SECTIONS = [
    {
        id: 'account',
        title: 'Account',
        items: [
            {
                id: 'team-overview',
                type: 'modal',
                modalName: 'teamOverview',
                title: 'Team overview',
                description: 'Customize your team by changing its name, selecting a language, adding a logo, and more.',
                icon: 'CustomizeIcon'
            },
            {
                id: 'early-preview',
                type: 'toggle',
                featureKey: 'earlyPreview',
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
                type: 'toggle',
                featureKey: 'replay',
                title: 'Replay',
                description: 'Allow members to review and approve videos, images, and audio.',
                icon: 'ReplayIcon'
            },
            {
                id: 'password',
                type: 'toggle',
                featureKey: 'password',
                title: 'Password',
                description: 'Turn NexFiles Passwords on or off and track password health scores.',
                icon: 'PasswordPrimaryIcon'
            },
            {
                id: 'record',
                type: 'toggle',
                featureKey: 'record',
                title: 'Record',
                description: 'Grant members access to the team space and enable caption generation.',
                icon: 'RecordIcon'
            },
            {
                id: 'send-monitor',
                type: 'toggle',
                featureKey: 'sendAndMonitor',
                title: 'Send and monitor',
                description: 'Share files securely and track how recipients view and interact with your content using Send and Track.',
                icon: 'TrackIcon'
            }
        ]
    }
];