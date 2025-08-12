import React from 'react';
import CreateFolderModal from '@/components/modules/Modals/CreateFolderModal';
// import UploadFileModal from './UploadFileModal';
// import EditDocumentModal from './EditDocumentModal';
// سایر مدال‌ها را در اینجا import کنید

const ModalManager = () => {
  return (
    <>
      <CreateFolderModal />
      {/* سایر مدال‌ها */}
      {/* <UploadFileModal /> */}
      {/* <EditDocumentModal /> */}
    </>
  );
};

export default ModalManager;