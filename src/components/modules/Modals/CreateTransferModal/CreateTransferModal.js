"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { CloseIcon } from '@/components/ui/icons';
import useModalStore from '@/store/ui/modalStore';
import useTransferFiles from '@/hooks/createTransferModal/useTransferFiles';
import { useCreateTransfer } from '@/hooks/transfers/useCreateTransfer';
import TransferSuccessView from '@/components/templates/transfer/TransferSuccessView';
import TransferDropZone from './TransferDropZone';
import TransferFilesPanel from './TransferFilesPanel';
import TransferRecipientsFields from './TransferRecipientsFields';
import TransferModalFooter from './TransferModalFooter';
import NexFilePicker from './NexFilePicker';
import { TRANSFER_DEFAULT_EXPIRY_DAYS } from '@/utils/constants/transferConstants';

// Modal title for each step of the flow
const VIEW_TITLES = {
    upload: 'Create transfer',
    picker: 'Add from NexFile',
    success: 'Transfer Ready',
};

const CreateTransferModal = () => {
    const router = useRouter();
    const { modals, closeModal } = useModalStore();
    const { isOpen } = modals.createTransfer || {};

    const {
        files,
        isDragging,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleFileSelect,
        addLibraryFiles,
        removeFile,
        clearFiles,
    } = useTransferFiles();

    const { createTransfer, isCreating, processedCount } = useCreateTransfer();

    const [view, setView] = useState('upload');
    const [transferType, setTransferType] = useState('link');
    const [result, setResult] = useState(null);

    // Email delivery
    const [recipients, setRecipients] = useState([]);
    const [message, setMessage] = useState('');

    // Transfer settings
    const [expiresInDays, setExpiresInDays] = useState(TRANSFER_DEFAULT_EXPIRY_DAYS);
    const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isEmail = transferType === 'email';
    const addedFileIds = files.map((entry) => entry.fileId).filter(Boolean);
    const dragHandlers = { onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop };

    const handleClose = () => {
        closeModal('createTransfer');
        clearFiles();
        setView('upload');
        setTransferType('link');
        setResult(null);
        setRecipients([]);
        setMessage('');
        setExpiresInDays(TRANSFER_DEFAULT_EXPIRY_DAYS);
        setIsPasswordEnabled(false);
        setPassword('');
        setIsPasswordVisible(false);
    };

    // Turning the toggle off clears the field so a stale value is never sent
    const handlePasswordEnabledChange = (next) => {
        setIsPasswordEnabled(next);
        if (!next) {
            setPassword('');
            setIsPasswordVisible(false);
        }
    };

    const handleAddLibraryFiles = (selectedFiles) => {
        addLibraryFiles(selectedFiles);
        setView('upload');
    };

    const handleCreateTransfer = async () => {
        const created = await createTransfer({
            files,
            type: transferType,
            groupName: files[0]?.name || 'Untitled Transfer',
            expiresInDays,
            password: isPasswordEnabled ? password : null,
            recipients: isEmail ? recipients : [],
            message: isEmail ? message : '',
        });

        if (!created) return;

        setResult(created);
        setView('success');
    };

    // Opens the new transfer's details page, where it can be extended or ended
    const handleManageTransfer = () => {
        const transferId = result?.transfer?.id;
        handleClose();
        if (transferId) router.push(`/transfer/${transferId}`);
    };

    const settings = {
        expiresInDays,
        onExpiryChange: setExpiresInDays,
        isPasswordEnabled,
        onPasswordEnabledChange: handlePasswordEnabledChange,
        password,
        onPasswordChange: setPassword,
        isPasswordVisible,
        onPasswordVisibilityToggle: () => setIsPasswordVisible((prev) => !prev),
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='520px'>
            <div className="w-full">
                {/* Header */}
                <div className='flex justify-between items-center gap-2 self-stretch mb-4 sm:mb-6'>
                    <h2 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white truncate'>
                        {VIEW_TITLES[view]}
                    </h2>
                    <button onClick={handleClose} className='btn-icon-elegant shrink-0' aria-label='Close'>
                        <CloseIcon />
                    </button>
                </div>

                {view === 'picker' && (
                    <NexFilePicker
                        addedFileIds={addedFileIds}
                        onAdd={handleAddLibraryFiles}
                        onCancel={() => setView('upload')}
                    />
                )}

                {view === 'upload' && (
                    <div className='animate-in fade-in-0 slide-in-from-left-5 duration-300'>
                        {files.length === 0 ? (
                            <TransferDropZone
                                isDragging={isDragging}
                                dragHandlers={dragHandlers}
                                onFileSelect={handleFileSelect}
                                onOpenPicker={() => setView('picker')}
                            />
                        ) : (
                            <div className='flex flex-col gap-4 sm:gap-6'>
                                <TransferFilesPanel
                                    files={files}
                                    isDragging={isDragging}
                                    dragHandlers={dragHandlers}
                                    onFileSelect={handleFileSelect}
                                    onOpenPicker={() => setView('picker')}
                                    onRemoveFile={removeFile}
                                    transferType={transferType}
                                    onTransferTypeChange={setTransferType}
                                    isBusy={isCreating}
                                />

                                {isEmail && (
                                    <TransferRecipientsFields
                                        recipients={recipients}
                                        onRecipientsChange={setRecipients}
                                        message={message}
                                        onMessageChange={setMessage}
                                        disabled={isCreating}
                                    />
                                )}

                                <TransferModalFooter
                                    settings={settings}
                                    isCreating={isCreating}
                                    processedCount={processedCount}
                                    filesCount={files.length}
                                    transferType={transferType}
                                    onCreate={handleCreateTransfer}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* No way back to upload here, since sending again would duplicate the transfer */}
                {view === 'success' && result && (
                    <TransferSuccessView
                        shareLink={result.transfer.link}
                        delivery={result.delivery}
                        onManage={handleManageTransfer}
                    />
                )}
            </div>
        </BaseModal>
    );
};

export default CreateTransferModal;