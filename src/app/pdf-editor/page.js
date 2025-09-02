import { AddPageIcon, AddTextIcon, ChevronDownIcon, ChevronDownWhiteIcon, CloseIcon, EditIcon, HelpCircleIcon, HighlightIcon, MaximizeIcon, RedTrashIcon, SignToolIcon, VuesaxLinearRotateLeftIcon, VuesaxLinearRotateRightIcon, ZoomInIcon, ZoomOutIcon } from '@/components/ui/icons'
import React from 'react'

const page = () => {
    return (
        <div className='flex justify-center items-center'>
            {/* Main Content */}
            <div className='flex flex-col items-start flex-shrink-0 w-full'>
                {/* Header */}
                <div className='flex justify-between items-center w-full  py-4 px-8 bg-white'>
                    <CloseIcon />
                    <div className='flex items-center gap-3'>
                        <h3 className='text-medium-16'>File.pdf</h3>
                        <EditIcon />
                    </div>
                    {/* User Menu */}
                    <div className='flex items-center justify-center gap-3'>
                        <button className='flex justify-center items-center h-8 w-8 py-[13px]  gap-1.5 rounded-lg border border-stroke-300 bg-white shadow-light'>
                            <HelpCircleIcon />
                        </button>
                        <button className='flex justify-center items-center h-8  py-[13px] px-[14px] gap-1.5 rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14'>
                            Cancel
                        </button>
                        <button className='flex justify-center items-center h-8  py-[13px] px-[14px] gap-1.5 rounded-lg border border-[#5749BF] bg-gradient-primary shadow-heavy text-medium-14-white'>
                            Save
                            <ChevronDownWhiteIcon />
                        </button>
                    </div>
                </div>
                {/* Toolbar */}
                <div className='flex justify-between items-center w-full py-4 px-8 border-b border-gray-100 bg-white'>
                    <div className='flex items-center gap-4'>
                        {/* Page info */}
                        <div className='flex items-center gap-2 pr-2 border-r border-stroke-500'>
                            <p className='text-regular-14-neutral-500'>Page:</p>
                            <button className='flex items-center justify-center gap-1.5 w-8 h-8 py-[13px] px-3 rounded-lg border border-stroke-300 bg-white text-medium-14'>1</button>
                            <p className='text-regular-14-neutral-500'>of 2</p>
                        </div>
                        {/* Toolbar Items */}
                        <div className='flex items-center gap-2 pr-2 border-r border-stroke-500'>
                            <VuesaxLinearRotateRightIcon />
                            <VuesaxLinearRotateLeftIcon />
                            <AddPageIcon />
                            <RedTrashIcon />
                        </div>
                        {/* Editing tools */}
                        <div className='flex items-center gap-2'>
                            <div className='flex items-center gap-1'>
                                <EditIcon />
                                <p className='text-regular-14-neutral-500'>Draw</p>
                            </div>
                            <div className='flex items-center gap-1'>
                                <HighlightIcon />
                                <p className='text-regular-14-neutral-500'>Highlight</p>
                            </div>
                            <div className='flex items-center gap-1'>
                                <div className='flex items-center justify-center w-4 h-4'>
                                    <AddTextIcon />
                                </div>
                                <p className='text-regular-14-neutral-500'>Add text</p>
                            </div>
                            <div className='flex items-center gap-1'>
                                <SignToolIcon />
                                <p className='text-regular-14-neutral-500'>Sign</p>
                            </div>
                        </div>
                    </div>
                    {/* Zoom controls */}
                    <div className='flex justify-center items-center gap-3'>
                        <div className='flex items-center gap-3'>
                            <ZoomInIcon />
                            <svg xmlns="http://www.w3.org/2000/svg" width="2" height="16" viewBox="0 0 2 16" fill="none">
                                <path d="M1 0L1 16" stroke="#E1E0E5" />
                            </svg>
                            <ZoomOutIcon />
                        </div>
                        <button className='flex items-center justify-center gap-1 h-8 py-[13px] pr-2 pl-[14px] rounded-lg border border-stroke-300 shadow-light bg-white text-medium-14'>
                            100%
                            <ChevronDownIcon />
                        </button>
                        <button className='flex items-center justify-center gap-1.5 h-8 w-8 py-[13px] rounded-lg border border-stroke-300 shadow-light bg-white '>
                            <MaximizeIcon />
                        </button>
                    </div>
                </div>
                {/*Main area */}
                <div className='flex flex-1 items-start self-stretch'>
                    {/* Sidebar */}
                    <div className='flex flex-col justify-center items-start py-8 px-6  gap-8 w-[200p] self-stretch border-r border-t border-stroke-200 bg-white'>
                        {/* Page thumbnails */}
                        <div className='flex flex-1 flex-col items-center gap-8 self-stretch'>
                            {/* Page thumbnail container */}
                            <div className='flex flex-col items-center gap-2'>
                                <div className='flex flex-col items-center gap-[1.882px] w-[112px] h-[158.494px] p-[11.294px] rounded border-[1.5px] border-primary-500 bg-white'>
                                    <div className='flex flex-col items-start gap-[4.518px] self-stretch'>
                                        {/* Page content */}
                                        <div className='flex flex-col items-start gap-[2.259px] self-stretch '>
                                            <div className='flex items-center gap-2 self-stretch'>
                                                <div className="flex-1 h-px bg-gradient-to-r from-gray-600 to-transparent"></div>

                                                <p style={{
                                                    color: '#2E2E37',
                                                    fontFamily: 'Inter',
                                                    fontSize: '3.765px',
                                                    fontStyle: 'normal',
                                                    fontWeight: '600',
                                                    lineHeight: '150%',
                                                    letterSpacing: '-0.075px'
                                                }}>
                                                    Ugly websites sell better.
                                                </p>

                                                <div className="flex-1 h-px bg-gradient-to-l from-gray-600 to-transparent"></div>
                                            </div>
                                            <p style={{
                                                color: '#2E2E37',
                                                fontFamily: 'Inter',
                                                fontSize: '2.259px',
                                                fontStyle: 'normal',
                                                fontWeight: '400',
                                                lineHeight: 'normal',
                                                letterSpacing: '-0.023px'
                                            }}>
                                                I've been in the web design business since 1998. It has gone through some phases, but the place its at right now feels the weirdest in a long time.

                                                For years UX designers battled the "dribbblization" of the industry. What it means, is creating eye-candy projects and posing them as serious work.

                                                Beautiful at first glance, but either impossible to code, or completely dysfunctional.
                                            </p>
                                        </div>
                                        {/* Page text */}
                                        <div className='flex flex-col items-start gap-[2.259px] self-stretch '></div>
                                    </div>
                                </div>
                                <p className='text-medium-14'>1</p>
                            </div>
                            {/* Page Thumbnail */}
                            <div className='flex flex-col items-center gap-2'></div>
                        </div>
                        {/* Filter Button */}
                        <div className='flex items-center justify-center gap-1 h-8 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100'></div>
                    </div>
                    {/* Main */}
                    <div className='flex flex-1 flex-col justify-center items-center py-6 px-8 self-stretch bg-stroke-200'></div>
                </div>
            </div>
        </div>
    )
}

export default page