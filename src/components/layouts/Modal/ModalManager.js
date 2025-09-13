import React from 'react';
import CreateFolderModal from '@/components/modules/Modals/CreateFolderModal';
import ShareModal from '@/components/modules/Modals/ShareModal/ShareModal';
import CreateFileModal from '@/components/modules/Modals/CreateFileModal/CreateFileModal';
import ShareSettingsModal from '@/components/modules/Modals/shareSettingsModal/ShareSettingsModal';
import EditPdfModal from '@/components/modules/Modals/editPdfModal/EditPdfModal';
import CreateSignatureModal from '@/components/modules/Modals/CreateSignatureModal/CreateSignatureModal';

// import UploadFileModal from './UploadFileModal';
// import EditDocumentModal from './EditDocumentModal';
// سایر مدال‌ها را در اینجا import کنید

const ModalManager = () => {
  return (
    <>
      <CreateFolderModal />
      <ShareModal />
      <CreateFileModal />
      <ShareSettingsModal />
      <EditPdfModal />
      <CreateSignatureModal />
      {/* سایر مدال‌ها */}
      {/* <UploadFileModal /> */}
      {/* <EditDocumentModal /> */}
    </>
  );
};

export default ModalManager;