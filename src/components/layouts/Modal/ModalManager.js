import React from 'react';
import CreateFolderModal from '@/components/modules/Modals/CreateFolderModal';
import ShareModal from '@/components/modules/Modals/ShareModal/ShareModal';
import CreateFileModal from '@/components/modules/Modals/CreateFileModal/CreateFileModal';
import ShareSettingsModal from '@/components/modules/Modals/shareSettingsModal/ShareSettingsModal';
import EditPdfModal from '@/components/modules/Modals/editPdfModal/EditPdfModal';
import CreateSignatureModal from '@/components/modules/Modals/CreateSignatureModal/CreateSignatureModal';
import FileRequest from '@/components/modules/Modals/FileRequestModal/FileRequest';
import ShareFileRequest from '@/components/modules/Modals/FileRequestModal/ShareFileRequest';
import DeletePermanentModal from '@/components/modules/Modals/DeletedFiles/DeletePermanentModal/DeletePermanentModal';
import CreateTransferModal from '@/components/modules/Modals/CreateTransferModal/CreateTransferModal';
import UploadFileModal from '@/components/modules/Modals/UploadFileModal/UploadFileModal';
import RenameModal from '@/components/modules/Modals/RenameModal/RenameModal';  // ✅ Add this

const ModalManager = () => {
  return (
    <>
      <CreateFolderModal />
      <ShareModal />
      <CreateFileModal />
      <ShareSettingsModal />
      <EditPdfModal />
      <CreateSignatureModal />
      <FileRequest />
      <ShareFileRequest />
      <DeletePermanentModal />
      <CreateTransferModal />
      <UploadFileModal />
      <RenameModal />
    </>
  );
};

export default ModalManager;