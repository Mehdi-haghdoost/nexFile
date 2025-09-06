"use client";

import React, { useState } from 'react';
import {
    VuesaxLinearRotateRightIcon,
    VuesaxLinearRotateLeftIcon,
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

const PdfEditorToolbar = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages] = useState(2);
    const [zoomLevel, setZoomLevel] = useState(100);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
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

    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 25, 200));
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 25, 50));
    };

    const ToolButton = ({ icon: Icon, label, onClick, className = "" }) => (
        <button
            onClick={onClick}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${className}`}
            aria-label={label}
            title={label}
        >
            <Icon />
        </button>
    );

    const ToolGroup = ({ icon: Icon, label }) => (
        <div className='flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors cursor-pointer'>
            <Icon />
            <span className='text-regular-14-neutral-500'>{label}</span>
        </div>
    );

    return (
        <nav className='flex justify-between items-center w-full py-4 px-8 border-b border-gray-100 bg-white'>
            {/* Left Section - Page Controls */}
            <div className='flex items-center gap-4'>
                {/* Page Navigation */}
                <div className='flex items-center gap-2 pr-2 border-r border-stroke-500'>
                    <span className='text-regular-14-neutral-500'>Page:</span>
                    <button 
                        className='flex items-center justify-center gap-1.5 w-8 h-8 py-[13px] px-3 rounded-lg border border-stroke-300 bg-white text-medium-14 hover:bg-gray-50 transition-colors'
                        onClick={() => {/* Handle page selector */}}
                    >
                        {currentPage}
                    </button>
                    <span className='text-regular-14-neutral-500'>of {totalPages}</span>
                </div>

                {/* Page Tools */}
                <div className='flex items-center gap-2 pr-2 border-r border-stroke-500'>
                    <ToolButton 
                        icon={VuesaxLinearRotateRightIcon} 
                        label="Rotate right" 
                        onClick={handleRotateRight} 
                    />
                    <ToolButton 
                        icon={VuesaxLinearRotateLeftIcon} 
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

                {/* Editing Tools */}
                <div className='flex items-center gap-2'>
                    <ToolGroup icon={EditIcon} label="Draw" />
                    <ToolGroup icon={HighlightIcon} label="Highlight" />
                    <ToolGroup icon={AddTextIcon} label="Add text" />
                    <ToolGroup icon={SignToolIcon} label="Sign" />
                </div>
            </div>

            {/* Right Section - Zoom Controls */}
            <div className='flex justify-center items-center gap-3'>
                <div className='flex items-center gap-3'>
                    <ToolButton 
                        icon={ZoomInIcon} 
                        label="Zoom in" 
                        onClick={handleZoomIn} 
                    />
                    
                    <div className="w-px h-4 bg-stroke-500" aria-hidden="true" />
                    
                    <ToolButton 
                        icon={ZoomOutIcon} 
                        label="Zoom out" 
                        onClick={handleZoomOut} 
                    />
                </div>
                
                <button className='flex items-center justify-center gap-1 h-8 py-[13px] pr-2 pl-[14px] rounded-lg border border-stroke-300 shadow-light bg-white text-medium-14 hover:bg-gray-50 transition-colors'>
                    {zoomLevel}%
                    <ChevronDownIcon />
                </button>
                
                <ToolButton 
                    icon={MaximizeIcon} 
                    label="Fullscreen" 
                    className="flex items-center justify-center gap-1  h-8 w-8 py-[13px] border border-stroke-300 shadow-light bg-white" 
                />
            </div>
        </nav>
    );
};

export default PdfEditorToolbar;