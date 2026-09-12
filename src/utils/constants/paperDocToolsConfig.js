import {
    CodeIcon,
    FoldersIcon,
    LinearIcon,
    ListIcon,
    ListNumbersIcon,
    PhotoIcon,
    SectionIcon,
    TableIcon,
    VideoIcon
} from '@/components/ui/icons';

// Single source of truth for the paper-doc editor toolbar
// EDITOR_TOOL_IDS is consumed by the transform layer in utils/paper-doc/editorActions.js
export const EDITOR_TOOL_IDS = {
    IMAGE: 'photo',
    VIDEO: 'video',
    LINK: 'folders',
    TABLE: 'table',
    DIVIDER: 'linear',
    BULLET_LIST: 'list',
    NUMBERED_LIST: 'numberedList',
    HEADING: 'section',
    CODE: 'code',
};

// Drives the rendered toolbar buttons in order
export const EDITOR_TOOLS = [
    { id: EDITOR_TOOL_IDS.IMAGE, icon: PhotoIcon, label: 'Insert image' },
    { id: EDITOR_TOOL_IDS.VIDEO, icon: VideoIcon, label: 'Insert video link' },
    { id: EDITOR_TOOL_IDS.LINK, icon: FoldersIcon, label: 'Insert link' },
    { id: EDITOR_TOOL_IDS.TABLE, icon: TableIcon, label: 'Insert table' },
    { id: EDITOR_TOOL_IDS.DIVIDER, icon: LinearIcon, label: 'Insert divider' },
    { id: EDITOR_TOOL_IDS.BULLET_LIST, icon: ListIcon, label: 'Bullet list' },
    { id: EDITOR_TOOL_IDS.NUMBERED_LIST, icon: ListNumbersIcon, label: 'Numbered list' },
    { id: EDITOR_TOOL_IDS.HEADING, icon: SectionIcon, label: 'Heading' },
    { id: EDITOR_TOOL_IDS.CODE, icon: CodeIcon, label: 'Code block' },
];

// Tools that must ask the user for a value before anything is inserted
export const EDITOR_TOOL_INPUTS = {
    [EDITOR_TOOL_IDS.IMAGE]: {
        title: 'Insert image',
        label: 'Image URL',
        placeholder: 'https://example.com/photo.png',
        confirmText: 'Insert',
    },
    [EDITOR_TOOL_IDS.VIDEO]: {
        title: 'Insert video link',
        label: 'Video URL',
        placeholder: 'https://example.com/video.mp4',
        confirmText: 'Insert',
    },
    [EDITOR_TOOL_IDS.LINK]: {
        title: 'Insert link',
        label: 'Link URL',
        placeholder: 'https://example.com',
        confirmText: 'Insert',
    },
};

// Markdown skeleton inserted by the table tool
export const EDITOR_TABLE_TEMPLATE = [
    '| Column 1 | Column 2 | Column 3 |',
    '| --- | --- | --- |',
    '|  |  |  |',
    '|  |  |  |',
].join('\n');

// Characters inserted when Tab is pressed inside the textarea
export const EDITOR_INDENT = '  ';

// How long a toolbar button keeps its active highlight after being used
export const EDITOR_TOOL_FLASH_MS = 600;

// Delay before local textarea content is pushed up to the page state
export const EDITOR_CONTENT_SYNC_MS = 300;