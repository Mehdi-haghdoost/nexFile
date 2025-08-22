import React from 'react';
import CreateFolderModal from '@/components/modules/Modals/CreateFolderModal';
import ShareModal from '@/components/modules/Modals/ShareModal/ShareModal';
// import UploadFileModal from './UploadFileModal';
// import EditDocumentModal from './EditDocumentModal';
// سایر مدال‌ها را در اینجا import کنید

const ModalManager = () => {
  return (
    <>
      <CreateFolderModal />
      <ShareModal />
      {/* سایر مدال‌ها */}
      {/* <UploadFileModal /> */}
      {/* <EditDocumentModal /> */}
    </>
  );
};

export default ModalManager;