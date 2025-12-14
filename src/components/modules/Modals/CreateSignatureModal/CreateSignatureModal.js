"use client";
import React, { useState } from 'react'
import BaseModal from '@/components/layouts/Modal/BaseModal'
import useModalStore from '@/store/ui/modalStore';
import { CloseIcon, DrawIcon, SaveIcon, TypeIcon, UploadIcon, ChevronDownIcon } from '@/components/ui/icons';
import DrawContent from './DrawContent';
import TypeContent from './TypeContent';
import UploadContent from './UploadContent';
import SavedContent from './SavedContent';

const CreateSignatureModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen, data } = modals.createSignature;
    const [activeTab, setActiveTab] = useState('draw');
    const [signatureName, setSignatureName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleClose = () => {
        closeModal('createSignature');
        setSignatureName('');
        setActiveTab('draw');
        setIsDropdownOpen(false);
    };

    const handleCancel = () => {
        handleClose();
    }

    const handleCreateSignature = async () => {
        if (!signatureName.trim()) {
            alert('Please enter a signature name');
            return;
        }

        setIsCreating(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert(`Signature "${signatureName}" created successfully!`);
            handleClose();
        } catch (error) {
            alert('Failed to create signature. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    const isSubmitDisabled = () => {
        return isCreating || !signatureName.trim();
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'draw':
                return <DrawContent />;
            case 'type':
                return <TypeContent />;
            case 'upload':
                return <UploadContent />;
            case 'saved':
                return <SavedContent />;
            default:
                return <DrawContent />;
        }
    };

    const tabs = [
        { id: 'draw', label: 'Draw', icon: <DrawIcon /> },
        { id: 'type', label: 'Type', icon: <TypeIcon /> },
        { id: 'upload', label: 'Upload', icon: <UploadIcon /> },
        { id: 'saved', label: 'Saved', icon: <SaveIcon /> }
    ];

    const showFooterButtons = activeTab !== 'saved';

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setIsDropdownOpen(false);
    };

    const getActiveTabInfo = () => {
        return tabs.find(tab => tab.id === activeTab);
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='640px' maxWidth='95vw'>
            <article className="w-full flex flex-col max-h-[80vh] sm:max-h-[85vh]">
                {/* Header Section */}
                <header className="flex-shrink-0">
                    <section className='flex flex-col items-start gap-4 sm:gap-6 self-stretch'>
                        {/* Modal Header */}
                        <header className='flex justify-between items-center gap-2 self-stretch'>
                            <h1 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white truncate'>Create Signature</h1>
                            <button 
                                onClick={handleClose} 
                                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors shrink-0" 
                                aria-label="Close modal"
                            >
                                <CloseIcon />
                            </button>
                        </header>

                        {/* Signature Name Form */}
                        {activeTab !== 'saved' && (
                            <form className='flex flex-col items-start gap-1.5 sm:gap-2 self-stretch' onSubmit={(e) => e.preventDefault()}>
                                <fieldset className='flex flex-col items-start gap-1.5 sm:gap-2 self-stretch border-0 p-0 m-0'>
                                    <legend className='sr-only'>Signature Information</legend>
                                    <label htmlFor="signatureName" className='text-xs sm:text-sm font-medium text-neutral-500 dark:text-white'>
                                        Signature Name
                                    </label>
                                    <input
                                        id="signatureName"
                                        type="text"
                                        value={signatureName}
                                        onChange={(e) => setSignatureName(e.target.value)}
                                        placeholder="Enter signature name"
                                        className='flex h-9 sm:h-10 px-3 py-2 items-center gap-2 self-stretch rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white text-xs sm:text-sm text-neutral-500 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-400 focus:outline-none focus:border-primary-500 dark:bg-neutral-900 transition-colors'
                                        disabled={isCreating}
                                        required
                                    />
                                </fieldset>
                            </form>
                        )}

                        {/* Navigation Tabs - Desktop & Tablet (336px+) */}
                        <nav 
                            className='hidden min-[336px]:flex justify-center items-center gap-0.5 sm:gap-1 h-9 sm:h-10 w-full p-0.5 rounded-lg border border-[#ECECEE] dark:border-neutral-700 bg-[#F6F6F7] dark:bg-neutral-900' 
                            role="tablist"
                        >
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    role="tab"
                                    aria-selected={activeTab === tab.id}
                                    aria-controls={`${tab.id}-panel`}
                                    className={`flex flex-1 items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 self-stretch rounded-lg whitespace-nowrap min-w-fit transition-all ${
                                        activeTab === tab.id 
                                            ? 'border border-[#F2F2F3] dark:border-dark-border bg-white dark:bg-dark-gradient shadow-middle' 
                                            : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
                                    }`}
                                >
                                    <span className="text-xs sm:text-sm shrink-0" aria-hidden="true">{tab.icon}</span>
                                    <h3 className={`text-xs sm:text-sm font-medium ${
                                        activeTab === tab.id 
                                            ? 'text-neutral-500 dark:text-white' 
                                            : 'text-neutral-500 dark:text-neutral-300'
                                    }`}>
                                        {tab.label}
                                    </h3>
                                </button>
                            ))}
                        </nav>

                        {/* Navigation Dropdown - Mobile Small (<336px) */}
                        <div className='min-[336px]:hidden relative w-full'>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className='flex items-center justify-between w-full h-10 px-3 py-2 rounded-lg border border-[#ECECEE] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors'
                                aria-expanded={isDropdownOpen}
                                aria-haspopup="true"
                            >
                                <div className='flex items-center gap-2'>
                                    <span className="text-sm shrink-0" aria-hidden="true">
                                        {getActiveTabInfo()?.icon}
                                    </span>
                                    <span className='text-sm font-medium text-neutral-500 dark:text-white'>
                                        {getActiveTabInfo()?.label}
                                    </span>
                                </div>
                                <ChevronDownIcon 
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                        isDropdownOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <>
                                    {/* Backdrop */}
                                    <div 
                                        className='fixed inset-0 z-[9997]'
                                        onClick={() => setIsDropdownOpen(false)}
                                    />
                                    
                                    {/* Menu */}
                                    <div className='absolute top-full left-0 right-0 mt-1 py-1 bg-white dark:bg-neutral-800 border border-[#ECECEE] dark:border-neutral-700 rounded-lg shadow-dropdown dark:shadow-dark-dropdown z-[9998] animate-fade-in'>
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => handleTabChange(tab.id)}
                                                className={`flex items-center gap-2 w-full px-3 py-2.5 text-left transition-colors ${
                                                    activeTab === tab.id
                                                        ? 'bg-primary-50 dark:bg-neutral-700 text-primary-500 dark:text-white'
                                                        : 'hover:bg-gray-50 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-300'
                                                }`}
                                            >
                                                <span className="text-sm shrink-0" aria-hidden="true">
                                                    {tab.icon}
                                                </span>
                                                <span className='text-sm font-medium'>
                                                    {tab.label}
                                                </span>
                                                {activeTab === tab.id && (
                                                    <svg 
                                                        className="ml-auto w-4 h-4 shrink-0" 
                                                        fill="none" 
                                                        viewBox="0 0 24 24" 
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </section>
                </header>

                {/* Main Content Area */}
                <main
                    className="flex-1 pt-4 sm:pt-6 pr-2 -mr-4 min-h-0 overflow-y-auto custom-scrollbar"
                    role="tabpanel"
                    id={`${activeTab}-panel`}
                    aria-labelledby={`${activeTab}-tab`}
                >
                    {renderContent()}
                </main>

                {/* Footer Section */}
                {showFooterButtons && (
                    <footer className="flex-shrink-0 pt-4 sm:pt-6">
                        <section className='flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 self-stretch'>
                            <button
                                onClick={handleCancel}
                                disabled={isCreating}
                                type="button"
                                className='w-full sm:w-auto flex items-center justify-center gap-2 h-9 sm:h-10 py-2 sm:py-3 px-4 sm:px-6 rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-light text-xs sm:text-sm font-medium text-neutral-500 dark:text-white text-center disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateSignature}
                                disabled={isSubmitDisabled()}
                                type="submit"
                                className='w-full sm:w-auto flex items-center justify-center gap-2 h-9 sm:h-10 py-2 sm:py-3 px-4 sm:px-6 rounded-lg border border-primary-500 shadow-middle bg-gradient-primary text-xs sm:text-sm font-medium text-white disabled:opacity-50 hover:opacity-90 transition-opacity'
                            >
                                {isCreating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating...
                                    </>
                                ) : (
                                    'Create Signature'
                                )}
                            </button>
                        </section>
                    </footer>
                )}
            </article>
        </BaseModal>
    )
}

export default CreateSignatureModal;