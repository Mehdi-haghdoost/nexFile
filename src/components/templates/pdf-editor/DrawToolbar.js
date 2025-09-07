'use client';
import React from 'react';

const DrawToolbar = () => {
    console.log('DrawToolbar rendered!');
    
    return (
        <div className='flex items-center justify-between self-stretch py-4 px-8 border-t border-b border-l border-stroke-200 bg-white'>
            <div className='flex items-center gap-4'>
                <h3 className='text-medium-14'>Draw Tools Active!</h3>
                <div className='flex items-center gap-2'>
                    <button className='px-3 py-1.5 text-sm border border-stroke-300 rounded hover:bg-gray-50 transition-colors'>
                        Pen Tool
                    </button>
                    <button className='px-3 py-1.5 text-sm border border-stroke-300 rounded hover:bg-gray-50 transition-colors'>
                        Brush
                    </button>
                    <button className='px-3 py-1.5 text-sm border border-stroke-300 rounded hover:bg-gray-50 transition-colors'>
                        Eraser
                    </button>
                </div>
            </div>
            
            <div className='flex items-center gap-3'>
                <span className='text-regular-12-neutral-500'>Tool Settings:</span>
                <div className='flex items-center gap-2'>
                    <button className='px-2 py-1 text-xs border border-stroke-300 rounded hover:bg-gray-50 transition-colors'>
                        Color
                    </button>
                    <button className='px-2 py-1 text-xs border border-stroke-300 rounded hover:bg-gray-50 transition-colors'>
                        Size
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DrawToolbar;