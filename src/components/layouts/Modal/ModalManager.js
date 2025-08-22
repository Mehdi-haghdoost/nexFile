import React from 'react';
import CreateFolderModal from '@/components/modules/Modals/CreateFolderModal';
import ShareModal from '@/components/modules/Modals/ShareModal/ShareModal';
import CreateFileModal from '@/components/modules/Modals/CreateFileModal/CreateFileModal';
// import UploadFileModal from './UploadFileModal';
// import EditDocumentModal from './EditDocumentModal';
// سایر مدال‌ها را در اینجا import کنید

const ModalManager = () => {
  return (
    <>
      <CreateFolderModal />
      <ShareModal />
      <CreateFileModal />
      {/* سایر مدال‌ها */}
      {/* <UploadFileModal /> */}
      {/* <EditDocumentModal /> */}
    </>
  );
};

export default ModalManager;