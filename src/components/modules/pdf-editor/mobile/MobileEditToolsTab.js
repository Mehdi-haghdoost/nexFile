'use client';
import React from 'react';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import { EDIT_TOOLS } from '@/utils/constants/pdfEditorToolsConfig';

const MobileEditToolsTab = ({ onToolPicked }) => {
    const { activeEditingTool, setActiveEditingTool } = usePdfEditorStore();

    return (
        <div className='grid grid-cols-2 gap-3'>
            {EDIT_TOOLS.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeEditingTool === tool.id;

                return (
                    <button
                        key={tool.id}
                        onClick={() => {
                            setActiveEditingTool(tool.id);
                            onToolPicked();
                        }}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            isActive
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300'
                        }`}
                    >
                        <Icon className={`w-8 h-8 ${isActive ? 'text-primary-500' : 'text-neutral-500 dark:text-white'}`} />
                        <span className={`text-sm font-medium ${isActive ? 'text-primary-500' : 'text-neutral-500 dark:text-white'}`}>
                            {tool.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default MobileEditToolsTab;