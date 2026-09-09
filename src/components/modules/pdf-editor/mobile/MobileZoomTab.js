'use client';
import React from 'react';
import { ZoomInIcon, ZoomOutIcon } from '@/components/ui/icons';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import { ZOOM_OPTIONS } from '@/utils/constants/pdfEditorConstants';

const MobileZoomTab = ({ onClose }) => {
    const { zoomLevel, zoomMode, setZoomLevel, enableFitToWidth, zoomIn, zoomOut } = usePdfEditorStore();

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-800'>
                <span className='text-sm text-neutral-500 dark:text-white'>Current Zoom:</span>
                <span className='text-2xl font-bold text-primary-500'>
                    {zoomMode === 'fit' ? 'Fit' : `${zoomLevel}%`}
                </span>
            </div>

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

            <button
                onClick={() => {
                    enableFitToWidth();
                    onClose();
                }}
                className={`py-3 rounded-lg text-sm font-medium transition-all ${
                    zoomMode === 'fit'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-neutral-800 text-neutral-500 dark:text-white'
                }`}
            >
                Fit to width
            </button>

            <div className='grid grid-cols-4 gap-2'>
                {ZOOM_OPTIONS.map((option) => (
                    <button
                        key={option}
                        onClick={() => {
                            setZoomLevel(option);
                            onClose();
                        }}
                        className={`py-3 rounded-lg text-sm font-medium transition-all ${
                            zoomMode === 'fixed' && option === zoomLevel
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 dark:bg-neutral-800 text-neutral-500 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700'
                        }`}
                    >
                        {option}%
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MobileZoomTab;