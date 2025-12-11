'use client';
import { useState, useEffect } from 'react';
import Navbar from '../Home/Navbar';
import Header from '../Home/Header';
import FolderSidebar from './FolderSidebar';

const FolderLayout = ({ children }) => {
    const [isFolderSidebarOpen, setIsFolderSidebarOpen] = useState(false);

    // Lock body scroll when sidebar is open on mobile
    useEffect(() => {
        if (isFolderSidebarOpen && typeof window !== 'undefined' && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isFolderSidebarOpen]);

    return (
        <div className='flex justify-center items-start w-full min-h-screen bg-white dark:bg-neutral-900 overflow-x-hidden'>
            {/* دکمه Hamburger - Fixed در سمت چپ */}
            <button
                onClick={() => setIsFolderSidebarOpen(!isFolderSidebarOpen)}
                className="lg:hidden fixed left-0 top-60 z-[55] p-2.5 rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-all duration-200"
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

            <div className='flex w-full max-w-[1440px] overflow-x-hidden'>
                <div className='flex flex-shrink-0'>
                    <Navbar />
                    <FolderSidebar 
                        isOpen={isFolderSidebarOpen}
                        onToggle={setIsFolderSidebarOpen}
                    />
                </div>
                <div className='flex flex-1 flex-col items-start min-w-0 border-t border-r border-l border-[#F2F2F3] dark:border-neutral-800'>
                    <Header />
                    <main className='w-full overflow-x-hidden'>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default FolderLayout;