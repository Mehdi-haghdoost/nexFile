'use client';
import React, { useState } from 'react';
import {
    EditIcon,
    HighlightIcon,
    AddTextIcon,
    SignToolIcon,
    RotateRightIcon,
    RotateLeftIcon,
    AddPageIcon,
    RedTrashIcon,
    ZoomInIcon,
    ZoomOutIcon,
    ChevronDownIcon,
    CloseIcon
} from '@/components/ui/icons';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';

const MobileToolsPanel = ({ isOpen, onClose }) => {
    const { 
        currentPage, 
        totalPages, 
        zoomLevel,
        activeEditingTool,
        setCurrentPage,
        setActiveEditingTool,
        setZoomLevel,
        zoomIn,
        zoomOut
    } = usePdfEditorStore();
    
    const [activeTab, setActiveTab] = useState('edit'); // edit, page, zoom
    const [showZoomDropdown, setShowZoomDropdown] = useState(false);

    const zoomOptions = [25, 50, 75, 100, 125, 150, 200];

    const editTools = [
        { id: 'draw', icon: EditIcon, label: 'Draw' },
        { id: 'highlight', icon: HighlightIcon, label: 'Highlight' },
        { id: 'addText', icon: AddTextIcon, label: 'Add text' },
        { id: 'sign', icon: SignToolIcon, label: 'Sign' }
    ];

    const pageActions = [
        { id: 'rotate-right', icon: RotateRightIcon, label: 'Rotate right', action: () => console.log('Rotate right') },
        { id: 'rotate-left', icon: RotateLeftIcon, label: 'Rotate left', action: () => console.log('Rotate left') },
        { id: 'add-page', icon: AddPageIcon, label: 'Add page', action: () => console.log('Add page') },
        { id: 'delete-page', icon: RedTrashIcon, label: 'Delete page', action: () => console.log('Delete page') }
    ];

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className='lg:hidden fixed inset-0 bg-black/50 z-40'
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className='lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 rounded-t-2xl shadow-2xl border-t border-stroke-300 dark:border-neutral-700 max-h-[70vh] overflow-hidden flex flex-col animate-slide-up'>
                {/* Handle */}
                <div className='flex justify-center py-2'>
                    <div className='w-12 h-1 bg-gray-300 dark:bg-neutral-600 rounded-full' />
                </div>

                {/* Header */}
                <div className='flex items-center justify-between px-4 pb-3 border-b border-stroke-300 dark:border-neutral-700'>
                    <h3 className='text-base font-semibold text-neutral-500 dark:text-white'>Tools</h3>
                    <button
                        onClick={onClose}
                        className='p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded transition-colors'
                        aria-label="Close tools"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className='flex items-center gap-1 px-4 py-3 border-b border-stroke-300 dark:border-neutral-700'>
                    <button
                        onClick={() => setActiveTab('edit')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            activeTab === 'edit'
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 dark:bg-neutral-800 text-neutral-500 dark:text-white'
                        }`}
                    >
                        Edit Tools
                    </button>
                    <button
                        onClick={() => setActiveTab('page')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            activeTab === 'page'
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 dark:bg-neutral-800 text-neutral-500 dark:text-white'
                        }`}
                    >
                        Page
                    </button>
                    <button
                        onClick={() => setActiveTab('zoom')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            activeTab === 'zoom'
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 dark:bg-neutral-800 text-neutral-500 dark:text-white'
                        }`}
                    >
                        Zoom
                    </button>
                </div>

                {/* Content */}
                <div className='flex-1 overflow-y-auto p-4'>
                    {/* Edit Tools Tab */}
                    {activeTab === 'edit' && (
                        <div className='grid grid-cols-2 gap-3'>
                            {editTools.map((tool) => {
                                const Icon = tool.icon;
                                return (
                                    <button
                                        key={tool.id}
                                        onClick={() => {
                                            setActiveEditingTool(tool.id);
                                            onClose();
                                        }}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                                            activeEditingTool === tool.id
                                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                                : 'border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300'
                                        }`}
                                    >
                                        <Icon className={`w-8 h-8 ${
                                            activeEditingTool === tool.id 
                                                ? 'text-primary-500' 
                                                : 'text-neutral-500 dark:text-white'
                                        }`} />
                                        <span className={`text-sm font-medium ${
                                            activeEditingTool === tool.id
                                                ? 'text-primary-500'
                                                : 'text-neutral-500 dark:text-white'
                                        }`}>
                                            {tool.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Page Tab */}
                    {activeTab === 'page' && (
                        <div className='flex flex-col gap-4'>
                            {/* Page Navigation */}
                            <div className='flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-800'>
                                <span className='text-sm text-neutral-500 dark:text-white'>Current Page:</span>
                                <div className='flex items-center gap-2'>
                                    <button 
                                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                        className='p-2 rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 disabled:opacity-50'
                                        disabled={currentPage === 1}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <span className='text-lg font-semibold text-neutral-500 dark:text-white min-w-[60px] text-center'>
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button 
                                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                        className='p-2 rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 disabled:opacity-50'
                                        disabled={currentPage === totalPages}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Page Actions */}
                            <div className='grid grid-cols-2 gap-3'>
                                {pageActions.map((action) => {
                                    const Icon = action.icon;
                                    return (
                                        <button
                                            key={action.id}
                                            onClick={() => {
                                                action.action();
                                                onClose();
                                            }}
                                            className='flex flex-col items-center gap-2 p-4 rounded-xl border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300 transition-all'
                                        >
                                            <Icon className="w-8 h-8 text-neutral-500 dark:text-white" />
                                            <span className='text-sm font-medium text-neutral-500 dark:text-white text-center'>
                                                {action.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Zoom Tab */}
                    {activeTab === 'zoom' && (
                        <div className='flex flex-col gap-4'>
                            {/* Current Zoom */}
                            <div className='flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-800'>
                                <span className='text-sm text-neutral-500 dark:text-white'>Current Zoom:</span>
                                <span className='text-2xl font-bold text-primary-500'>{zoomLevel}%</span>
                            </div>

                            {/* Zoom Controls */}
                            <div className='flex items-center gap-3'>
                                <button
                                    onClick={zoomOut}
                                    className='flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300 transition-all'
                                >
                                    <ZoomOutIcon className="w-6 h-6" />
                                    <span className='text-sm font-medium'>Zoom Out</span>
                                </button>
                                <button
                                    onClick={zoomIn}
                                    className='flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300 transition-all'
                                >
                                    <ZoomInIcon className="w-6 h-6" />
                                    <span className='text-sm font-medium'>Zoom In</span>
                                </button>
                            </div>

                            {/* Preset Zoom Levels */}
                            <div className='grid grid-cols-4 gap-2'>
                                {zoomOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setZoomLevel(option);
                                            onClose();
                                        }}
                                        className={`py-3 rounded-lg text-sm font-medium transition-all ${
                                            option === zoomLevel
                                                ? 'bg-primary-500 text-white'
                                                : 'bg-gray-100 dark:bg-neutral-800 text-neutral-500 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700'
                                        }`}
                                    >
                                        {option}%
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MobileToolsPanel;