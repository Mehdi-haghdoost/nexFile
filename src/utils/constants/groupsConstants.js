export const GROUPS_MOCK_DATA = [
    {
        id: 1,
        name: 'UI/UX Designer',
        icon: {
            gradient: 'from-[#F35154] to-[#C71D20]'
        },
        membersCount: 5,
        manager: {
            name: 'Adrian Carter',
            avatar: '/images/adrian.png'
        },
        permission: 'Manage acccess'
    },
    {
        id: 2,
        name: 'Team Illustration',
        icon: {
            gradient: 'from-[#ECD65C] to-[#CBB018]'
        },
        membersCount: 7,
        manager: {
            name: 'Bella Thompson',
            avatar: '/images/bella.png'
        },
        permission: 'Manage acccess'
    },
    {
        id: 3,
        name: 'Project Manager',
        icon: {
            gradient: 'from-[#5C9FEC] to-[#186BCB]'
        },
        membersCount: 7,
        manager: {
            name: 'Daniel Foster',
            avatar: '/images/daniel.png'
        },
        permission: 'Manage acccess'
    }
];

export const GROUP_TYPES = {
    ALL: 'all',
    DESIGN: 'design',
    DEVELOPMENT: 'development',
    MANAGEMENT: 'management'
};

export const GROUP_PERMISSIONS = {
    MANAGE_ACCESS: 'Manage acccess',
    VIEW_ONLY: 'View only',
    EDIT: 'Edit'
};