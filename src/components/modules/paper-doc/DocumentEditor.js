import React, { useState } from 'react'
import EditorToolbar from './EditorToolbar';

const DocumentEditor = ({ content, onContentChange }) => {
    const [activeTool, setActiveTool] = useState(null);



    const handleContentChange = (e) => {
        if (onContentChange) {
            onContentChange(e.target.value)
        }
    }

    const handleToolSelect = (toolId) => {
        setActiveTool(prevTool => prevTool === toolId ? null : toolId);
        console.log('Tool selected:', toolId);

        switch (toolId) {
            case 'photo':
                // Logic برای اضافه کردن عکس
                break;
            case 'video':
                // Logic برای اضافه کردن ویدیو
                break;
            case 'table':
                // Logic برای اضافه کردن جدول
                break;
            default:
                break;
        }
    }


    return (
        <div className='flex flex-col flex-1 w-full bg-gray-50 overflow-hidden'>
            <div className='flex flex-col flex-1 items-start p-8 md:p-16 lg:p-24 gap-4 bg-white self-stretch overflow-y-auto'>
                <h2 className='text-3xl font-semibold text-gray-700'>Give a Title</h2>
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder='Type something'
                    className='flex-1 w-full text-base resize-none outline-none border-none p-0 bg-transparent'
                />
            </div>

            <div className='flex justify-center items-center p-4 bg-white border-t'>
                <EditorToolbar
                    onToolSelect={handleToolSelect}
                    activeTool={activeTool}
                />
            </div>
        </div>
    );
}

export default DocumentEditor