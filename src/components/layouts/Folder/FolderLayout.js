'use client';
import { useState } from 'react';
import Navbar from '../Home/Navbar';
import Header from '../Home/Header';
import FolderSidebar from './FolderSidebar';

const FolderLayout = ({ children }) => {
    const [isFolderSidebarOpen, setIsFolderSidebarOpen] = useState(false);

    return (
        <div className='flex justify-center items-start w-full min-h-screen bg-white dark:bg-neutral-900 relative'>
            {/* دکمه Hamburger - Fixed در سمت چپ */}
            <button
                onClick={() => setIsFolderSidebarOpen(!isFolderSidebarOpen)}
                className="lg:hidden fixed left-0 top-60 z-50 p-2.5 rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-all duration-200"
                aria-label="Toggle folder menu"
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-neutral-500 dark:text-white transition-transform duration-200"
                >
                    {isFolderSidebarOpen ? (
                        <>
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </>
                    ) : (
                        <>
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </>
                    )}
                </svg>
            </button>

            <div className='flex w-full max-w-[1440px]'>
                <div className='flex'>
                    <Navbar />
                    <FolderSidebar 
                        isOpen={isFolderSidebarOpen}
                        onToggle={setIsFolderSidebarOpen}
                    />
                </div>
                <div className='flex flex-1 flex-col items-start flex-shrink-0 border-t border-r border-l border-[#F2F2F3] dark:border-neutral-800'>
                    <Header />
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FolderLayout;