'use client';

import React, { useEffect, useRef } from 'react';
import useModalStore from '@/store/modalStore';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import FormHeader from '@/components/templates/home/file-requests/components/form/FormHeader';
import FormFields from '@/components/templates/home/file-requests/components/FormFields';
import ConditionalFields from '@/components/templates/home/file-requests/components/form/ConditionalFields';
import FormActions from '@/components/templates/home/file-requests/components/form/FormActions';
import { useFolders } from '@/hooks/createFileModal/useFolders';
import { useFileRequestForm } from '@/hooks/FileRequestModal/useFileRequestForm';
import { useFileRequestSubmit } from '@/hooks/FileRequestModal/useFileRequestSubmit';
import { useFormAutoScroll, getScrollableModalClasses } from '@/utils/formScroll';

const FileRequest = () => {
  const { modals, closeModal } = useModalStore();
  const { isOpen } = modals.fileRequest;

  const { folders, isLoading: isFoldersLoading, error: foldersError } = useFolders();
  const { formData, setters, handlers, isFormValid, resetForm } = useFileRequestForm();

  const modalContentRef = useRef(null);
  const formActionsRef = useRef(null);

  const scrollClasses = getScrollableModalClasses('90vh');

  // Set default folder
  useEffect(() => {
    if (folders.length > 0 && !formData.selectedFolder) {
      const defaultFolder = folders.find(f => f.name === 'Campaign Design') || folders[0];
      setters.setSelectedFolder(defaultFolder);
    }
  }, [folders, formData.selectedFolder]);

  // Auto scroll
  useFormAutoScroll(
    { hasPassword: formData.hasPassword, hasDeadline: formData.hasDeadline },
    formActionsRef,
    modalContentRef
  );

  const handleClose = () => {
    resetForm();
    closeModal('fileRequest');
  };

  const { handleSubmit, isLoading } = useFileRequestSubmit(formData, handleClose);

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} width='600px'>
      <div className={scrollClasses.container}>
        <div ref={modalContentRef} className={scrollClasses.content}>
          <form className='flex flex-col items-start gap-6 self-stretch' onSubmit={handleSubmit}>
            <FormHeader onClose={handleClose} />

            <div className='flex flex-col items-start gap-5 self-stretch'>
              <FormFields
                title={formData.title}
                description={formData.description}
                setTitle={setters.setTitle}
                setDescription={setters.setDescription}
                folders={folders}
                selectedFolder={formData.selectedFolder}
                onFolderSelect={handlers.folder.onSelect}
                isFoldersLoading={isFoldersLoading}
                foldersError={foldersError}
              />

              <ConditionalFields
                hasDeadline={formData.hasDeadline}
                hasPassword={formData.hasPassword}
                handlers={handlers}
                deadlineDate={formData.deadlineDate}
                deadlineTime={formData.deadlineTime}
                password={formData.password}
                confirmPassword={formData.confirmPassword}
              />
            </div>

            <div ref={formActionsRef} className="w-full">
              <FormActions
                onCancel={handleClose}
                isLoading={isLoading}
                isFormValid={isFormValid()}
              />
            </div>
          </form>
        </div>
      </div>
    </BaseModal>
  );
};

export default FileRequest;