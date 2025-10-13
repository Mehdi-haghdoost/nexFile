import {
    PlayIcon,
    WhiteUploadIcon,
    ShareIcon,
    PdfIcon,
    MonitorIcon,
    SignatureIcon,
} from '@/components/ui/icons';

/**
 * Dashboard Tools Configuration
 */
export const DASHBOARD_TOOLS = [
    // Column 1
    [
        {
            id: 'replay',
            icon: PlayIcon,
            title: 'Organize media projects using Replay',
            description: 'Streamline feedback and speed up approvals',
            action: 'OPEN_REPLAY',
        },
        {
            id: 'send-files',
            icon: WhiteUploadIcon,
            title: 'Send files to external recipients',
            description: 'Effortlessly work together with others',
            action: 'OPEN_SEND_FILES',
        },
    ],
    // Column 2
    [
        {
            id: 'share-files',
            icon: ShareIcon,
            title: 'Securely share large files with anyone',
            description: 'Securely send large files with delivery confirmation',
            action: 'OPEN_SHARE',
        },
        {
            id: 'pdf-editor',
            icon: PdfIcon,
            title: 'Modify PDF files',
            description: 'Modify text, rearrange pages, and more',
            action: 'OPEN_PDF_EDITOR',
        },
    ],
    // Column 3
    [
        {
            id: 'monitor',
            icon: MonitorIcon,
            title: 'Monitor shared files',
            description: 'Obtain detailed analytics for each page',
            action: 'OPEN_ANALYTICS',
        },
        {
            id: 'signatures',
            icon: SignatureIcon,
            title: 'Obtain signatures on documents',
            description: 'Ask for signatures and sign documents yourself',
            action: 'OPEN_SIGNATURES',
        },
    ],
];

/**
 * Default License Configuration
 */
export const DEFAULT_LICENSE_DATA = {
    used: 2,
    total: 3,
    available: 1,
};

/**
 * Default Storage Configuration
 */
export const DEFAULT_STORAGE_DATA = {
    usedBytes: 0,
    totalGB: 100,
};

/**
 * Storage Units for conversion
 */
export const STORAGE_UNITS = {
    BYTES: 'bytes',
    KB: 'KB',
    MB: 'MB',
    GB: 'GB',
    TB: 'TB',
};

/**
 * Storage size multiplier (1024 bytes = 1 KB)
 */
export const STORAGE_MULTIPLIER = 1024;

/**
 * Dashboard Section Texts
 */
export const DASHBOARD_TEXTS = {
    teamUsage: {
        title: 'Team usage',
    },
    license: {
        title: 'Licenses',
        description: (used, total) => `Utilizing ${used} out of ${total} licenses on your Business Trial`,
        available: (count) => `${count} ${count === 1 ? 'license' : 'licenses'} available`,
        buttonText: 'Invite members',
    },
    storage: {
        title: 'Storage',
        description: (used, total) => `Using ${used} out of ${total}`,
        remaining: (remaining) => `${remaining} remaining`,
        buttonText: 'Manage storage',
    },
    tools: {
        title: 'Tools provided with your subscription',
        description: 'Utilizing 2 out of 3 licenses on your Business Trial',
    },
};

/**
 * Dashboard Actions Types
 */
export const DASHBOARD_ACTIONS = {
    INVITE_MEMBERS: 'INVITE_MEMBERS',
    MANAGE_STORAGE: 'MANAGE_STORAGE',
    OPEN_REPLAY: 'OPEN_REPLAY',
    OPEN_SEND_FILES: 'OPEN_SEND_FILES',
    OPEN_SHARE: 'OPEN_SHARE',
    OPEN_PDF_EDITOR: 'OPEN_PDF_EDITOR',
    OPEN_ANALYTICS: 'OPEN_ANALYTICS',
    OPEN_SIGNATURES: 'OPEN_SIGNATURES',
};

/**
 * Progress Bar Colors
 */
export const PROGRESS_COLORS = {
    active: 'bg-[radial-gradient(89.28%_89%_at_49.61%_50.4%,#7E60F8_0%,#4C3CC6_100%)]',
    inactive: 'bg-[#EDECF9]',
};

/**
 * Grid Breakpoints Configuration
 */
export const GRID_BREAKPOINTS = {
    mobile: 'grid-cols-1',
    tablet: 'md:grid-cols-2',
    desktop: 'lg:grid-cols-3',
};