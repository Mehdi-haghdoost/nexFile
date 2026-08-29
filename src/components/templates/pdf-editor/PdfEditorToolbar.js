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
import { ZOOM_OPTIONS } from '@/utils/constants/pdfEditorConstants';

const PdfEditorToolbar = () => {
    const {
        currentPage,
        totalPages,
        zoomLevel,
        activeEditingTool,
        setActiveEditingTool,
        setCurrentPage,
        setZoomLevel,
        zoomIn,
        zoomOut
    } = usePdfEditorStore();

    const [showZoomDropdown, setShowZoomDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const [isEditingPage, setIsEditingPage] = useState(false);
    const [pageInput, setPageInput] = useState(String(currentPage));
    const pageInputRef = useRef(null);

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

    // Keep the input in sync with scroll-driven page changes while not editing.
    useEffect(() => {
        if (!isEditingPage) setPageInput(String(currentPage));
    }, [currentPage, isEditingPage]);

    useEffect(() => {
        if (isEditingPage) pageInputRef.current?.focus();
    }, [isEditingPage]);

    const startEditingPage = () => {
        setPageInput(String(currentPage));
        setIsEditingPage(true);
    };

    const commitPageInput = () => {
        const parsed = parseInt(pageInput, 10);
        if (!Number.isNaN(parsed)) setCurrentPage(parsed);
        setIsEditingPage(false);
    };

    const handlePageInputKeyDown = (event) => {
        if (event.key === 'Enter') commitPageInput();
        if (event.key === 'Escape') setIsEditingPage(false);
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
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors flex-shrink-0 ${className}`}
            aria-label={label}
            title={label}
        >
            <Icon className="w-5 h-5" />
        </button>
    );

    const ToolGroup = ({ icon: Icon, label, tool, isActive, onClick }) => (
        <button
            onClick={() => onClick(tool)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex-shrink-0 ${
                isActive
                    ? 'bg-primary-500/10 dark:bg-dark-overlay border border-primary-500 dark:border-neutral-500'
                    : 'hover:bg-gray-100 dark:hover:bg-neutral-600'
            }`}
        >
            <Icon className="w-5 h-5" />
            <span className={`text-sm font-medium whitespace-nowrap ${isActive ? 'text-primary-500 dark:text-primary-400' : 'text-neutral-500 dark:text-white'}`}>
                {label}
            </span>
        </button>
    );

    return (
        <nav className='flex justify-between items-center w-full py-4 px-6 lg:px-8 border-b border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex-shrink-0'>
            <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2 pr-4 border-r border-stroke-500'>
                    <span className='text-sm text-neutral-500 dark:text-white whitespace-nowrap'>Page:</span>
                    {isEditingPage ? (
                        <input
                            ref={pageInputRef}
                            type='number'
                            min={1}
                            max={totalPages}
                            value={pageInput}
                            onChange={(e) => setPageInput(e.target.value)}
                            onBlur={commitPageInput}
                            onKeyDown={handlePageInputKeyDown}
                            className='flex items-center justify-center w-10 h-8 px-1 rounded-lg border border-primary-500 bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-500 dark:text-white text-center outline-none'
                        />
                    ) : (
                        <button
                            onClick={startEditingPage}
                            className='flex items-center justify-center gap-1.5 w-10 h-8 px-3 rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors'
                        >
                            {currentPage}
                        </button>
                    )}
                    <span className='text-sm text-neutral-500 dark:text-white whitespace-nowrap'>of {totalPages}</span>
                </div>

                <div className='flex items-center gap-2 pr-4 border-r border-stroke-500'>
                    <ToolButton icon={RotateRightIcon} label="Rotate right" onClick={handleRotateRight} />
                    <ToolButton icon={RotateLeftIcon} label="Rotate left" onClick={handleRotateLeft} />
                    <ToolButton icon={AddPageIcon} label="Add page" onClick={handleAddPage} />
                    <ToolButton icon={RedTrashIcon} label="Delete page" onClick={handleDeletePage} />
                </div>

                <div className='flex items-center gap-2'>
                    <ToolGroup icon={EditIcon} label="Draw" tool="draw" isActive={activeEditingTool === 'draw'} onClick={setActiveEditingTool} />
                    <ToolGroup icon={HighlightIcon} label="Highlight" tool="highlight" isActive={activeEditingTool === 'highlight'} onClick={setActiveEditingTool} />
                    <ToolGroup icon={AddTextIcon} label="Add text" tool="addText" isActive={activeEditingTool === 'addText'} onClick={setActiveEditingTool} />
                    <ToolGroup icon={SignToolIcon} label="Sign" tool="sign" isActive={activeEditingTool === 'sign'} onClick={setActiveEditingTool} />
                </div>
            </div>

            <div className='flex justify-center items-center gap-3'>
                <div className='flex items-center gap-3'>
                    <ToolButton icon={ZoomInIcon} label="Zoom in" onClick={zoomIn} />
                    <div className="w-px h-4 bg-stroke-500" aria-hidden="true" />
                    <ToolButton icon={ZoomOutIcon} label="Zoom out" onClick={zoomOut} />
                </div>

                <div className='relative' ref={dropdownRef}>
                    <button
                        onClick={() => setShowZoomDropdown(!showZoomDropdown)}
                        className='flex items-center justify-center gap-1 h-8 py-2 pr-2 pl-3 rounded-lg border border-stroke-300 dark:border-dark-border shadow-light bg-white dark:bg-dark-gradient text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors'
                    >
                        {zoomLevel}%
                        <ChevronDownIcon className="w-4 h-4" />
                    </button>

                    {showZoomDropdown && (
                        <div className='absolute top-full mt-1 right-0 bg-white border border-stroke-300 dark:bg-neutral-900 dark:border-dark-border rounded-lg shadow-lg z-50 min-w-[80px]'>
                            {ZOOM_OPTIONS.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleZoomSelect(option)}
                                    className={`w-full px-3 py-2 text-left text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-600 first:rounded-t-lg last:rounded-b-lg transition-colors ${
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
                    className="flex items-center justify-center h-8 w-8 border border-stroke-300 shadow-light bg-white dark:bg-dark-gradient dark:border-dark-border rounded-lg"
                />
            </div>
        </nav>
    );
};

export default PdfEditorToolbar;