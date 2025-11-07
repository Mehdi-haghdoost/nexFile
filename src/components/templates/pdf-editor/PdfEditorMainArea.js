'use client';
import React from 'react';
import DrawToolbar from './DrawToolbar';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';

const PdfEditorMainArea = () => {
    const { activeEditingTool } = usePdfEditorStore();

    return (
        <main className={`flex flex-1 flex-col justify-center items-center ${activeEditingTool === 'draw' ? 'py-0' : 'py-6'}  px-8 self-stretch bg-stroke-200 border-t border-l border-stroke-200 dark:bg-neutral-700 dark:border-neutral-700`}>
            {/* Draw Toolbar - appears at top of main area when draw tool is active */}
            {activeEditingTool === 'draw' && (
                <div className='w-full mb-4'>
                    <DrawToolbar />
                </div>
            )}

            <div className='flex flex-col items-center w-[595px] h-[842px] p-[60px] gap-2.5 bg-white'>
                <div className='flex flex-col items-start gap-6 self-stretch overflow-hidden'>
                    {/* Document section */}
                    <div className='flex flex-col items-start gap-3 self-stretch'>
                        {/* Section header */}
                        <div className='flex items-center gap-3 self-stretch'>
                            <div className="flex-1 h-px bg-gradient-to-r from-gray-600 to-transparent"></div>

                            <p className='text-semibold-20'>
                                Ugly websites sell better.
                            </p>

                            <div className="flex-1 h-px bg-gradient-to-l from-gray-600 to-transparent"></div>
                        </div>
                        <p className='text-regular-12-neutral-500 self-stretch'>
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
                    <div className='flex flex-col items-start gap-3 self-stretch'>
                        <p className='text-semibold-16'>Understanding design</p>
                        <p className='text-regular-12-neutral-500 self-stretch'>Let's take a step back.</p>
                        <p className='text-regular-12-neutral-500 self-stretch'>
                            What is the role of a website? 99% of the time it's to sell something. To get you to click a button.
                        </p>
                        <img src="/images/pdf-img1.png" className='h-[239px] self-stretch aspect-[179/90]' alt="" />
                        <p className='text-regular-12-neutral-500 self-stretch'>
                            Beautiful background with mountains and a person gazing into the distance doesn't sell. Sure, it tickles your sense of aesthetics. I'll give you that.

                            But on its own that's only a piece of artwork. Nothing more.
                        </p>
                        <img src="/images/pdf-img2.png" className='h-[258.611px] self-stretch aspect-[90/49]' alt="" />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PdfEditorMainArea;