'use client';
import React, { useState } from 'react';
import { CloseIcon } from '@/components/ui/icons';
import { MOBILE_PANEL_TABS } from '@/utils/constants/pdfEditorConstants';
import MobileEditToolsTab from '@/components/modules/pdf-editor/mobile/MobileEditToolsTab';
import MobileStyleTab from '@/components/modules/pdf-editor/mobile/MobileStyleTab';
import MobilePageTab from '@/components/modules/pdf-editor/mobile/MobilePageTab';
import MobileZoomTab from '@/components/modules/pdf-editor/mobile/MobileZoomTab';

const MobileToolsPanel = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('edit');

    if (!isOpen) return null;

    return (
        <>
            <div
                className='lg:hidden fixed inset-0 bg-black/50 z-40'
                onClick={onClose}
            />

            <div className='lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 rounded-t-2xl shadow-2xl border-t border-stroke-300 dark:border-neutral-700 max-h-[70vh] overflow-hidden flex flex-col animate-slide-up'>
                <div className='flex justify-center py-2'>
                    <div className='w-12 h-1 bg-gray-300 dark:bg-neutral-600 rounded-full' />
                </div>

                <div className='flex items-center justify-between px-4 pb-3 border-b border-stroke-300 dark:border-neutral-700'>
                    <h3 className='text-base font-semibold text-neutral-500 dark:text-white'>Tools</h3>
                    <button
                        onClick={onClose}
                        className='p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded transition-colors'
                        aria-label="Close tools"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className='flex items-center gap-1 px-4 py-3 border-b border-stroke-300 dark:border-neutral-700 overflow-x-auto'>
                    {MOBILE_PANEL_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 min-w-fit py-2 px-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                                activeTab === tab.id
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 dark:bg-neutral-800 text-neutral-500 dark:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className='flex-1 overflow-y-auto p-4'>
                    {/* Style follows the tool choice so its settings are one tap away */}
                    {activeTab === 'edit' && <MobileEditToolsTab onToolPicked={() => setActiveTab('style')} />}
                    {activeTab === 'style' && <MobileStyleTab onClose={onClose} />}
                    {activeTab === 'page' && <MobilePageTab onClose={onClose} />}
                    {activeTab === 'zoom' && <MobileZoomTab onClose={onClose} />}
                </div>
            </div>
        </>
    );
};

export default MobileToolsPanel;