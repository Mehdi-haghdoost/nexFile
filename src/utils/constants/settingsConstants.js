// Feature flags stored under Organization.settings.features
export const SETTINGS_FEATURE_KEYS = ['password', 'sendAndMonitor'];

// Organization policies stored under Organization.settings.policies
export const SETTINGS_POLICY_KEYS = ['enforceTwoFactor'];

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
                id: 'enforce-two-factor',
                type: 'toggle',
                group: 'policies',
                settingKey: 'enforceTwoFactor',
                title: 'Require two-step verification',
                description: 'Members must set up an authenticator app before they can sign in.',
                icon: 'SettingIcon'
            }
        ]
    },
    {
        id: 'nexfile-product',
        title: 'NexFile product',
        items: [
            {
                id: 'password',
                type: 'toggle',
                group: 'features',
                settingKey: 'password',
                title: 'Password',
                description: 'Turn NexFiles Passwords on or off and track password health scores.',
                icon: 'PasswordPrimaryIcon'
            },
            {
                id: 'send-monitor',
                type: 'toggle',
                group: 'features',
                settingKey: 'sendAndMonitor',
                title: 'Send and monitor',
                description: 'Share files securely and track how recipients view and interact with your content using Send and Track.',
                icon: 'TrackIcon'
            }
        ]
    }
];