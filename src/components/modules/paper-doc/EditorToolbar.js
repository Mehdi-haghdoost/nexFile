import React from 'react';
import { EDITOR_TOOLS } from '@/utils/constants/paperDocToolsConfig';
import ToolbarButton from './ToolbarButton';

const EditorToolbar = ({ onToolSelect, activeTool }) => {
    const handleToolClick = (toolId) => {
        onToolSelect?.(toolId);
    };

    return (
        <div className='inline-flex items-center justify-center p-1 gap-1 bg-white dark:bg-dark-gradient shadow-heavy flex-col lg:flex-row rounded-r-xl lg:rounded-xl'>
            {EDITOR_TOOLS.map((tool) => (
                <ToolbarButton
                    key={tool.id}
                    icon={tool.icon}
                    label={tool.label}
                    isActive={activeTool === tool.id}
                    onClick={() => handleToolClick(tool.id)}
                />
            ))}
        </div>
    );
};

// Memoized so typing in the textarea never re-renders the whole toolbar
export default React.memo(EditorToolbar);