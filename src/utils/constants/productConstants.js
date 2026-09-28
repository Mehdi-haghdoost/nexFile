import {
    AutographIcon,
    CaptureIcon,
    KeepBoardIcon,
    KeepSendIcon,
    KeepUpIcon,
    PaperIcon,
    PasswordIcon,
    ReplyIcon,
    TransferIcon,
} from '@/components/ui/icons';

// The apps NexFile offers. Entries without a path are not built yet, so they
// are listed but not navigable, and the two dropdowns that show them agree
export const PRODUCTS = [
    {
        id: 'keepboard',
        title: 'KeepBoard',
        description: 'Easily search, organize, and share',
        Icon: KeepBoardIcon,
        path: null,
    },
    {
        id: 'reply',
        title: 'Reply',
        description: 'Speed up video review and approval',
        Icon: ReplyIcon,
        path: null,
    },
    {
        id: 'keepsend',
        title: 'KeepSend',
        description: 'Send documents and track activity',
        Icon: KeepSendIcon,
        path: null,
    },
    {
        id: 'autograph',
        title: 'Autograph',
        description: 'Get secure eSignatures for any Doc',
        Icon: AutographIcon,
        path: null,
    },
    {
        id: 'keepup',
        title: 'KeepUp',
        description: 'Auto back up all devices',
        Icon: KeepUpIcon,
        path: null,
    },
    {
        id: 'capture',
        title: 'Capture',
        description: 'Record screens and video messages',
        Icon: CaptureIcon,
        path: null,
    },
    {
        id: 'transfer',
        title: 'Transfer',
        description: 'Send large files securely',
        Icon: TransferIcon,
        path: '/transfer',
    },
    {
        id: 'paper',
        title: 'Paper',
        description: 'Brainstorm in shared docs',
        Icon: PaperIcon,
        path: '/paper-doc',
    },
    {
        id: 'password',
        title: 'Password',
        description: 'Sync passwords across devices',
        Icon: PasswordIcon,
        path: null,
    },
];

// Only the ones that lead somewhere, for the switcher inside a product
export const AVAILABLE_PRODUCTS = PRODUCTS.filter((product) => product.path);