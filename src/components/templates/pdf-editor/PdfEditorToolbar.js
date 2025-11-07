"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    RotateRightIcon,
    RotateLeftIcon,
    AddPageIcon,
    RedTrashIcon,
    EditIcon,
    HighlightIcon,
    AddTextIcon,
    SignToolIcon,
    ZoomInIcon,
    ZoomOutIcon,
    ChevronDownIcon,
    MaximizeIcon
} from '@/components/ui/icons';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';

const PdfEditorToolbar = () => {
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
    
    const [showZoomDropdown, setShowZoomDropdown] = useState(false);
    const dropdownRef = useRef(null);
    
    const zoomOptions = [25, 50, 75, 100, 125, 150, 200];

    const handleZoomSelect = (level) => {
        setZoomLevel(level);
        setShowZoomDropdown(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowZoomDropdown(false);
            }
        };

        if (showZoomDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showZoomDropdown]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRotateRight = () => {
        console.log('Rotating right');
    };

    const handleRotateLeft = () => {
        console.log('Rotating left');
    };

    const handleAddPage = () => {
        console.log('Adding page');
    };

    const handleDeletePage = () => {
        console.log('Deleting page');
    };

    const ToolButton = ({ icon: Icon, label, onClick, className = "" }) => (
        <button
            onClick={onClick}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors ${className}`}
            aria-label={label}
            title={label}
        >
            <Icon />
        </button>
    );

    const ToolGroup = ({ icon: Icon, label, tool, isActive, onClick }) => {
        const handleClick = () => {
            console.log('Tool clicked:', tool, 'Current active:', activeEditingTool);
            onClick(tool);
        };
        
        return (
            <button 
                onClick={handleClick}
                className={`flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer ${
                    isActive 
                        ? 'bg-primary-500/10 dark:bg-dark-overlay  border border-primary-500 dark:border-neutral-500' 
                        : 'hover:bg-gray-100 dark:hover:bg-neutral-600'
                }`}
            >
                <Icon />
                <span className={`text-regular-14-neutral-500 dark:text-regular-14-white ${isActive ? 'text-primary-500' : ''}`}>
                    {label}
                </span>
            </button>
        );
    };

    return (
        <nav className='flex justify-between items-center w-full py-4 px-8 border-b border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900'>
            <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2 pr-2 border-r border-stroke-500'>
                    <span className='text-regular-14-neutral-500 dark:text-regular-14-white'>Page:</span>
                    <button 
                        className='flex items-center justify-center gap-1.5 w-8 h-8 py-[13px] px-3 rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-medium-14 dark:text-medium-14-white hover:bg-gray-50 transition-colors'
                        onClick={() => {/* Handle page selector */}}
                    >
                        {currentPage}
                    </button>
                    <span className='text-regular-14-neutral-500 dark:text-medium-14-white'>of {totalPages}</span>
                </div>

                <div className='flex items-center gap-2 pr-2 border-r border-stroke-500'>
                    <ToolButton 
                        icon={RotateRightIcon} 
                        label="Rotate right" 
                        onClick={handleRotateRight} 
                    />
                    <ToolButton 
                        icon={RotateLeftIcon} 
                        label="Rotate left" 
                        onClick={handleRotateLeft} 
                    />
                    <ToolButton 
                        icon={AddPageIcon} 
                        label="Add page" 
                        onClick={handleAddPage} 
                    />
                    <ToolButton 
                        icon={RedTrashIcon} 
                        label="Delete page" 
                        onClick={handleDeletePage} 
                    />
                </div>

                <div className='flex items-center gap-2'>
                    <ToolGroup 
                        icon={EditIcon} 
                        label="Draw" 
                        tool="draw"
                        isActive={activeEditingTool === 'draw'}
                        onClick={setActiveEditingTool}
                    />
                    <ToolGroup 
                        icon={HighlightIcon} 
                        label="Highlight" 
                        tool="highlight"
                        isActive={activeEditingTool === 'highlight'}
                        onClick={setActiveEditingTool}
                    />
                    <ToolGroup 
                        icon={AddTextIcon} 
                        label="Add text" 
                        tool="addText"
                        isActive={activeEditingTool === 'addText'}
                        onClick={setActiveEditingTool}
                    />
                    <ToolGroup 
                        icon={SignToolIcon} 
                        label="Sign" 
                        tool="sign"
                        isActive={activeEditingTool === 'sign'}
                        onClick={setActiveEditingTool}
                    />
                </div>
            </div>

            <div className='flex justify-center items-center gap-3'>
                <div className='flex items-center gap-3'>
                    <ToolButton 
                        icon={ZoomInIcon} 
                        label="Zoom in" 
                        onClick={zoomIn} 
                    />
                    
                    <div className="w-px h-4 bg-stroke-500" aria-hidden="true" />
                    
                    <ToolButton 
                        icon={ZoomOutIcon} 
                        label="Zoom out" 
                        onClick={zoomOut} 
                    />
                </div>
                
                <div className='relative' ref={dropdownRef}>
                    <button 
                        onClick={() => setShowZoomDropdown(!showZoomDropdown)}
                        className='flex items-center justify-center gap-1 h-8 py-[13px] pr-2 pl-[14px] rounded-lg border border-stroke-300 dark:border-dark-border shadow-light bg-white dark:bg-dark-gradient text-medium-14 dark:text-medium-14-white hover:bg-gray-50 transition-colors'
                    >
                        {zoomLevel}%
                        <ChevronDownIcon />
                    </button>
                    
                    {showZoomDropdown && (
                        <div className='absolute top-full mt-1 right-0 bg-white border border-stroke-300 dark:bg-neutral-900 dark:border-dark-border rounded-lg shadow-lg z-50 min-w-[80px]'>
                            {zoomOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleZoomSelect(option)}
                                    className={`w-full px-3 py-2 text-left text-medium-14 dark:text-medium-14-white   hover:bg-gray-50 dark:hover:bg-neutral-600 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                                        option === zoomLevel ? 'bg-primary-500/10 dark:bg-transparent text-primary-500' : ''
                                    }`}
                                >
                                    {option}%
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                <ToolButton 
                    icon={MaximizeIcon} 
                    label="Fullscreen" 
                    className="flex items-center justify-center gap-1  h-8 w-8 py-[13px] border border-stroke-300 shadow-light bg-white dark:bg-dark-gradient dark:border-dark-border" 
                />
            </div>
        </nav>
    );
};

export default PdfEditorToolbar;