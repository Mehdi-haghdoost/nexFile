import {
    EditIcon,
    HighlightIcon,
    AddTextIcon,
    SignToolIcon,
    RotateRightIcon,
    RotateLeftIcon,
    AddPageIcon,
    RedTrashIcon,
} from '@/components/ui/icons';

export const EDIT_TOOLS = [
    { id: 'draw', icon: EditIcon, label: 'Draw' },
    { id: 'highlight', icon: HighlightIcon, label: 'Highlight' },
    { id: 'addText', icon: AddTextIcon, label: 'Add text' },
    { id: 'sign', icon: SignToolIcon, label: 'Sign' },
];

// Handlers are supplied by the caller since they need store access
export const PAGE_ACTIONS = [
    { id: 'rotate-right', icon: RotateRightIcon, label: 'Rotate right' },
    { id: 'rotate-left', icon: RotateLeftIcon, label: 'Rotate left' },
    { id: 'add-page', icon: AddPageIcon, label: 'Add page' },
    { id: 'delete-page', icon: RedTrashIcon, label: 'Delete page' },
];