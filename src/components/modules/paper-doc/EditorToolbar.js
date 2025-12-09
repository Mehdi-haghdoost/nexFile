import React from 'react';
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
import ToolbarButton from './ToolbarButton';

const EditorToolbar = ({ onToolSelect, activeTool }) => {
    const tools = [
        { id: 'photo', icon: PhotoIcon, label: 'Add Photo' },
        { id: 'video', icon: VideoIcon, label: 'Add Video' },
        { id: 'folders', icon: FoldersIcon, label: 'Add Folder' },
        { id: 'table', icon: TableIcon, label: 'Add Table' },
        { id: 'linear', icon: LinearIcon, label: 'Add Line' },
        { id: 'list', icon: ListIcon, label: 'Add List' },
        { id: 'numberedList', icon: ListNumbersIcon, label: 'Add Numbered List' },
        { id: 'section', icon: SectionIcon, label: 'Add Section' },
        { id: 'code', icon: CodeIcon, label: 'Add Code Block' }
    ];

    const handleToolClick = (toolId) => {
        if (onToolSelect) {
            onToolSelect(toolId);
        }
    };

    return (
        <div className='inline-flex items-center justify-center p-1 gap-1 bg-white dark:bg-dark-gradient shadow-heavy flex-col lg:flex-row rounded-r-xl lg:rounded-xl'>
            {tools.map((tool) => (
                <ToolbarButton
                    key={tool.id}
                    icon={tool.icon}
                    isActive={activeTool === tool.id}
                    onClick={() => handleToolClick(tool.id)}
                />
            ))}
        </div>
    );
};

export default EditorToolbar;