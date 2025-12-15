'use client';

import React, { useEffect, useRef } from 'react';
import useModalStore from '@/store/ui/modalStore';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import FormHeader from '@/components/modules/Modals/FileRequestModal/components/form/FormHeader';
import FormFields from '@/components/modules/Modals/FileRequestModal/components/FormFields';
import ConditionalFields from '@/components/modules/Modals/FileRequestModal/components/form/ConditionalFields';
import FormActions from '@/components/modules/Modals/FileRequestModal/components/form/FormActions';
import { useFolders } from '@/hooks/createFileModal/useFolders';
import { useFileRequestForm } from '@/hooks/FileRequestModal/useFileRequestForm';
import { useFileRequestSubmit } from '@/hooks/FileRequestModal/useFileRequestSubmit';

const FileRequest = () => {
  const { modals, closeModal, openModal } = useModalStore();
  const { isOpen } = modals.fileRequest;

  const { folders, isLoading: isFoldersLoading, error: foldersError } = useFolders();
  const { formData, setters, handlers, isFormValid, resetForm } = useFileRequestForm();

  const modalContentRef = useRef(null);

  // Set default folder
  useEffect(() => {
    if (folders.length > 0 && !formData.selectedFolder) {
      const defaultFolder = folders.find(f => f.name === 'Campaign Design') || folders[0];
      setters.setSelectedFolder(defaultFolder);
    }
  }, [folders, formData.selectedFolder, setters]);

  const handleClose = () => {
    resetForm();
    closeModal('fileRequest');
  };

  const { handleSubmit, isLoading } = useFileRequestSubmit(formData, (generatedLink) => {
    resetForm();
    closeModal('fileRequest');
    openModal('shareFileRequest', {
      link: generatedLink,
      title: formData.title,
      requestData: formData
    });
  });

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} width='600px'>
      <div 
        ref={modalContentRef}
        className='max-h-[85vh] sm:max-h-[90vh] custom-scrollbar overflow-x-hidden w-full'
      >
        <form className='flex flex-col items-start gap-4 sm:gap-6 self-stretch p-3 sm:p-4 md:p-6' onSubmit={handleSubmit}>
          <FormHeader onClose={handleClose} />

          <div className='flex flex-col items-start gap-4 sm:gap-5 self-stretch w-full'>
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

          <div className="w-full">
            <FormActions
              onCancel={handleClose}
              isLoading={isLoading}
              isFormValid={isFormValid()}
            />
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default FileRequest;