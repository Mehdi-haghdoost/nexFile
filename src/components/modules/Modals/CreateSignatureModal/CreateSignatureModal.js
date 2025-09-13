"use client";
import React, { useState } from 'react'
import BaseModal from '@/components/layouts/Modal/BaseModal'
import useModalStore from '@/store/modalStore';
import { CloseIcon, DrawIcon, SaveIcon, TypeIcon, UploadIcon } from '@/components/ui/icons';
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

    const handleClose = () => {
        closeModal('createSignature');
        setSignatureName('');
        setActiveTab('draw');
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
            // اینجا API call برای ایجاد امضا
            // await createSignature({ name: signatureName });

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

    // تب Saved فقط برای نمایش است و نیازی به دکمه‌های پایین ندارد
    const showFooterButtons = activeTab !== 'saved';

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='640px'>
            <article className="w-full flex flex-col max-h-[85vh]">
                {/* Header Section */}
                <header className="flex-shrink-0">
                    <section className='flex flex-col items-start gap-6 self-stretch'>
                        {/* Modal Header */}
                        <header className='flex justify-between items-center self-stretch'>
                            <h1 className='text-medium-18'>Create Signature</h1>
                            <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded" aria-label="Close modal">
                                <CloseIcon />
                            </button>
                        </header>

                        {/* Signature Name Form - فقط برای تب‌هایی که امضا جدید می‌سازند */}
                        {activeTab !== 'saved' && (
                            <form className='flex flex-col items-start gap-2 self-stretch' onSubmit={(e) => e.preventDefault()}>
                                <fieldset className='flex flex-col items-start gap-2 self-stretch border-0 p-0 m-0'>
                                    <legend className='sr-only'>Signature Information</legend>
                                    <label htmlFor="signatureName" className='text-medium-14 text-neutral-500'>
                                        Signature Name
                                    </label>
                                    <input
                                        id="signatureName"
                                        type="text"
                                        value={signatureName}
                                        onChange={(e) => setSignatureName(e.target.value)}
                                        placeholder="Enter signature name"
                                        className='flex h-10 px-3 py-2 items-center gap-2 self-stretch rounded-lg border border-stroke-300 bg-white text-regular-14 focus:outline-none focus:border-primary-500'
                                        disabled={isCreating}
                                        required
                                    />
                                </fieldset>
                            </form>
                        )}

                        {/* Navigation Tabs */}
                        <nav className='flex justify-center items-center gap-1 h-10 w-full p-0.5 rounded-lg border border-[#ECECEE] bg-[#F6F6F7]' role="tablist">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    role="tab"
                                    aria-selected={activeTab === tab.id}
                                    aria-controls={`${tab.id}-panel`}
                                    className={`flex flex-1 items-center justify-center gap-2 py-2 px-3 self-stretch rounded-lg transition-all ${activeTab === tab.id ? 'border border-[#F2F2F3] bg-white shadow-middle' : ''
                                        }`}
                                >
                                    <span className="text-sm" aria-hidden="true">{tab.icon}</span>
                                    <h3 className={activeTab === tab.id ? 'text-medium-14' : 'text-regular-14-neutral-500'}>
                                        {tab.label}
                                    </h3>
                                </button>
                            ))}
                        </nav>
                    </section>
                </header>

                {/* Main Content Area */}
                <main
                    className="flex-1 pt-6 pr-2 -mr-4 min-h-0 overflow-y-auto"
                    role="tabpanel"
                    id={`${activeTab}-panel`}
                    aria-labelledby={`${activeTab}-tab`}
                >
                    {renderContent()}
                </main>

                {/* Footer Section - فقط برای تب‌هایی که امضا جدید می‌سازند */}
                {showFooterButtons && (
                    <footer className="flex-shrink-0 pt-6">
                        <section className='flex items-center justify-end gap-3 self-stretch'>
                            <button
                                onClick={handleCancel}
                                disabled={isCreating}
                                type="button"
                                className='flex items-center justify-center gap-2 h-8 py-[13px] px-6 rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 text-center disabled:opacity-50 hover:bg-gray-50'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateSignature}
                                disabled={isSubmitDisabled()}
                                type="submit"
                                className='flex items-center justify-center gap-2 h-8 py-[13px] px-6 rounded-lg border border-primary-500 shadow-middle bg-gradient-primary text-medium-14-white disabled:opacity-50 hover:opacity-90'
                            >
                                {isCreating ? 'Creating...' : 'Create Signature'}
                            </button>
                        </section>
                    </footer>
                )}
            </article>
        </BaseModal>
    )
}

export default CreateSignatureModal