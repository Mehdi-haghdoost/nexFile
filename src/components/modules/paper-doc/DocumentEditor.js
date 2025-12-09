import React, { useState } from 'react';
import EditorToolbar from './EditorToolbar';

const DocumentEditor = ({ content, onContentChange }) => {
    const [activeTool, setActiveTool] = useState(null);
    const [isToolbarOpen, setIsToolbarOpen] = useState(false);

    const handleContentChange = (e) => {
        if (onContentChange) {
            onContentChange(e.target.value);
        }
    };

    const handleToolSelect = (toolId) => {
        setActiveTool(prevTool => prevTool === toolId ? null : toolId);
        console.log('Tool selected:', toolId);
        
        // Auto close on mobile
        setIsToolbarOpen(false);

        switch (toolId) {
            case 'photo':
                break;
            case 'video':
                break;
            case 'table':
                break;
            default:
                break;
        }
    };

    return (
        <div className='flex flex-col flex-1 w-full bg-gray-50 overflow-hidden'>
            {/* Editor Area */}
            <div className='flex flex-col flex-1 items-start p-8 md:p-16 lg:p-24 gap-4 bg-white self-stretch overflow-y-auto custom-scrollbar dark:bg-neutral-900 dark:border-neutral-800'>
                <h2 className='text-semibold-36 dark:text-semibold-36-neutral-300'>Give a Title</h2>
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder='Type something'
                    className='flex-1 w-full text-base resize-none dark:text-regular-16-neutral-300 outline-none border-none p-0 bg-transparent custom-scrollbar'
                />
            </div>

            {/* FAB - Mobile Toolbar Toggle (< 992px) */}
            <button
                onClick={() => setIsToolbarOpen(!isToolbarOpen)}
                className='lg:hidden fixed bottom-6 left-6 z-30 w-14 h-14 rounded-full bg-gradient-primary shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all'
                aria-label="Toggle toolbar"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isToolbarOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    )}
                </svg>
            </button>

            {/* Toolbar Overlay (< 992px) */}
            {isToolbarOpen && (
                <div 
                    className='lg:hidden fixed inset-0 bg-black/30 z-40'
                    onClick={() => setIsToolbarOpen(false)}
                />
            )}

            {/* Toolbar - Desktop: relative bottom, Mobile: fixed left */}
            <div className='lg:flex lg:justify-center lg:items-center lg:py-3 lg:px-4 lg:bg-white lg:border-t lg:border-stroke-200 lg:dark:bg-neutral-900 lg:dark:border-neutral-800 hidden'>
                <EditorToolbar
                    onToolSelect={handleToolSelect}
                    activeTool={activeTool}
                />
            </div>

            {/* Mobile Toolbar */}
            <div className={`
                lg:hidden
                fixed left-0 top-1/2 -translate-y-1/2 z-50
                transition-transform duration-300 ease-in-out
                ${isToolbarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <EditorToolbar
                    onToolSelect={handleToolSelect}
                    activeTool={activeTool}
                />
            </div>
        </div>
    );
};

export default DocumentEditor;