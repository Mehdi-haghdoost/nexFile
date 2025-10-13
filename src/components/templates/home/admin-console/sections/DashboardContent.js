import { UsersPlusIcon, VectorIcon } from '@/components/ui/icons';
import React from 'react';

const DashboardContent = () => (
    <main className='flex flex-1 flex-col gap-6 py-6 px-8 w-full max-w-full bg-white'>
        {/* Team Usage */}
        <section className='flex flex-col gap-4 w-full max-w-full'>
            <h2 className='text-medium-18'>Team usage</h2>
            
            {/* Team Usage Content */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 w-full'>
                {/* Licenses Section */}
                <article className='flex flex-col rounded-lg bg-white border border-stroke-300 min-w-0'>
                    {/* Licenses Info */}
                    <div className='flex flex-col gap-5 p-4'>
                        {/* Licenses Details */}
                        <div className='flex flex-col gap-1'>
                            <h3 className='text-medium-16'>Licenses</h3>
                            <p className='text-regular-12'>Utilizing 2 out of 3 licenses on your Business Trial</p>
                        </div>
                        {/* Licenses Progress Bar */}
                        <div className='flex items-center gap-2'>
                            <div className='h-[10px] flex-1 rounded-[8px] bg-[radial-gradient(89.28%_89%_at_49.61%_50.4%,#7E60F8_0%,#4C3CC6_100%)]'></div>
                            <div className='h-[10px] flex-1 rounded-[8px] bg-[radial-gradient(89.28%_89%_at_49.61%_50.4%,#7E60F8_0%,#4C3CC6_100%)]'></div>
                            <div className='h-[10px] flex-1 rounded-[4.722px] bg-[#EDECF9]'></div>
                        </div>
                    </div>
                    
                    {/* Licenses Footer */}
                    <footer className='flex flex-wrap justify-between items-center py-3 px-4 gap-2 border-t border-stroke-300'>
                        <h4 className='text-regular-14-neutral-500'>1 license available</h4>
                        <button className='flex justify-center items-center gap-1.5 py-[13px] px-3 h-8 rounded-lg border border-[#5749BF] shadow-heavy bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] text-medium-14-white text-sm whitespace-nowrap'>
                            <UsersPlusIcon />
                            Invite members
                        </button>
                    </footer>
                </article>
                
                {/* Storage Section */}
                <article className='flex flex-col rounded-lg bg-white border border-stroke-300 min-w-0'>
                    {/* Storage Info */}
                    <div className='flex flex-col gap-5 p-4'>
                        {/* Storage Details */}
                        <div className='flex flex-col gap-2'>
                            <h3 className='text-medium-14'>Storage</h3>
                            <p className='text-regular-12'>Using 0 bytes out of 100 GB</p>
                        </div>
                        {/* Storage Progress Bar */}
                        <div className='flex items-center gap-2'>
                            <div className='h-[10px] flex-1 rounded-[4.722px] bg-[#EDECF9]'></div>
                        </div>
                    </div>
                    
                    {/* Storage Footer */}
                    <footer className='flex flex-wrap justify-between items-center py-3 px-4 gap-2 border-t border-stroke-300'>
                        <h4 className='text-regular-14-neutral-500'>100 GB remaining</h4>
                        <button className='flex justify-center items-center gap-1.5 py-[13px] px-3 h-8 rounded-lg border border-stroke-300 shadow-light bg-white text-medium-14 text-sm whitespace-nowrap'>
                            Manage storage
                        </button>
                    </footer>
                </article>
            </div>
        </section>

        {/* Tools Section */}
        <section className='flex flex-col gap-5 p-4 rounded-lg border border-stroke-300 w-full max-w-full'>
        </section>
    </main>
);

export default DashboardContent;