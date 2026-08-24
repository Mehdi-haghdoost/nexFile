import {
    WhiteUploadIcon,
    ShareIcon,
    PdfIcon,
    SignatureIcon,
    TransferIcon,
    FilePlus01,
} from '@/components/ui/icons';

// Every tool maps to a screen or dialog that exists in the app.
export const DASHBOARD_TOOLS = [
    // Column 1
    [
        {
            id: 'send-files',
            icon: WhiteUploadIcon,
            title: 'Send files to external recipients',
            description: 'Effortlessly work together with others',
            action: 'OPEN_SEND_FILES',
        },
        {
            id: 'share-files',
            icon: ShareIcon,
            title: 'Securely share large files with anyone',
            description: 'Send large files with delivery confirmation',
            action: 'OPEN_SHARE',
        },
    ],
    // Column 2
    [
        {
            id: 'pdf-editor',
            icon: PdfIcon,
            title: 'Modify PDF files',
            description: 'Modify text, rearrange pages, and more',
            action: 'OPEN_PDF_EDITOR',
        },
        {
            id: 'signatures',
            icon: SignatureIcon,
            title: 'Obtain signatures on documents',
            description: 'Ask for signatures and sign documents yourself',
            action: 'OPEN_SIGNATURES',
        },
    ],
    // Column 3
    [
        {
            id: 'file-request',
            icon: FilePlus01,
            title: 'Request files from anyone',
            description: 'Collect files without asking for an account',
            action: 'OPEN_FILE_REQUEST',
        },
        {
            id: 'transfer',
            icon: TransferIcon,
            title: 'Transfer files',
            description: 'Move large files between people quickly',
            action: 'OPEN_TRANSFER',
        },
    ],
];

// Beyond this many seats a segmented bar becomes unreadable slivers,
// so the card falls back to a single continuous bar.
export const MAX_LICENSE_SEGMENTS = 10;

export const STORAGE_UNITS = {
    BYTES: 'bytes',
    KB: 'KB',
    MB: 'MB',
    GB: 'GB',
    TB: 'TB',
};

// 1024 bytes = 1 KB
export const STORAGE_MULTIPLIER = 1024;

export const DASHBOARD_TEXTS = {
    teamUsage: {
        title: 'Team usage',
    },
    license: {
        title: 'Licenses',
        buttonText: 'Invite members',
    },
    storage: {
        title: 'Storage',
        buttonText: 'Manage storage',
    },
    tools: {
        title: 'Tools provided with your subscription',
        description: 'Everything included with your current plan',
    },
};

export const DASHBOARD_ACTIONS = {
    OPEN_SEND_FILES: 'OPEN_SEND_FILES',
    OPEN_SHARE: 'OPEN_SHARE',
    OPEN_PDF_EDITOR: 'OPEN_PDF_EDITOR',
    OPEN_SIGNATURES: 'OPEN_SIGNATURES',
    OPEN_FILE_REQUEST: 'OPEN_FILE_REQUEST',
    OPEN_TRANSFER: 'OPEN_TRANSFER',
};

export const PROGRESS_COLORS = {
    active: 'bg-[radial-gradient(89.28%_89%_at_49.61%_50.4%,#7E60F8_0%,#4C3CC6_100%)]',
    inactive: 'bg-[#EDECF9]',
};

export const GRID_BREAKPOINTS = {
    mobile: 'grid-cols-1',
    tablet: 'md:grid-cols-2',
    desktop: 'lg:grid-cols-3',
};