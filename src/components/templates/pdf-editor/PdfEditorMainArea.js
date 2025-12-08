'use client';
import React from 'react';
import DrawToolbar from './DrawToolbar';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';

const PdfEditorMainArea = () => {
    const { activeEditingTool } = usePdfEditorStore();

    return (
        <main className='flex flex-1 flex-col items-center bg-stroke-200 dark:bg-neutral-700 overflow-hidden'>
            {/* Draw Toolbar - Desktop only */}
            {activeEditingTool === 'draw' && (
                <div className='hidden lg:block w-full flex-shrink-0'>
                    <DrawToolbar />
                </div>
            )}

            {/* PDF Document Container - Scrollable */}
            <div className='flex-1 w-full overflow-auto p-4 lg:p-6 flex items-start justify-center'>
                <div className='flex flex-col items-center w-full max-w-[595px] min-h-[842px] p-6 sm:p-10 lg:p-[60px] bg-white shadow-2xl mx-auto'>
                    <div className='flex flex-col items-start gap-4 lg:gap-6 w-full'>
                        {/* Document section */}
                        <div className='flex flex-col items-start gap-3 w-full'>
                            {/* Section header */}
                            <div className='flex items-center gap-3 w-full'>
                                <div className="flex-1 h-px bg-gradient-to-r from-gray-600 to-transparent"></div>
                                <p className='text-base sm:text-lg lg:text-xl font-semibold text-neutral-500 text-center px-2'>
                                    Ugly websites sell better.
                                </p>
                                <div className="flex-1 h-px bg-gradient-to-l from-gray-600 to-transparent"></div>
                            </div>
                            <p className='text-xs sm:text-sm text-neutral-500 w-full leading-relaxed'>
                                I've been in the web design business since 1998. It has gone through some phases, but the place its at right now feels the weirdest in a long time.
                                <br />
                                <br />
                                For years UX designers battled the "dribbblization" of the industry. What it means, is creating eye-candy projects and posing them as serious work.
                                <br />
                                <br />
                                Beautiful at first glance, but either impossible to code, or completely dysfunctional.
                            </p>
                        </div>
                        
                        {/* Section content */}
                        <div className='flex flex-col items-start gap-3 w-full'>
                            <p className='text-sm sm:text-base font-semibold text-neutral-500'>Understanding design</p>
                            <p className='text-xs sm:text-sm text-neutral-500 w-full'>Let's take a step back.</p>
                            <p className='text-xs sm:text-sm text-neutral-500 w-full'>
                                What is the role of a website? 99% of the time it's to sell something. To get you to click a button.
                            </p>
                            <img 
                                src="/images/pdf-img1.png" 
                                className='w-full h-auto rounded shadow-sm' 
                                alt="Design example 1" 
                            />
                            <p className='text-xs sm:text-sm text-neutral-500 w-full'>
                                Beautiful background with mountains and a person gazing into the distance doesn't sell. Sure, it tickles your sense of aesthetics. I'll give you that.
                                But on its own that's only a piece of artwork. Nothing more.
                            </p>
                            <img 
                                src="/images/pdf-img2.png" 
                                className='w-full h-auto rounded shadow-sm' 
                                alt="Design example 2" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PdfEditorMainArea;