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
      {/* سایر مدال‌ها */}
      {/* <UploadFileModal /> */}
      {/* <EditDocumentModal /> */}
    </>
  );
};

export default ModalManager;