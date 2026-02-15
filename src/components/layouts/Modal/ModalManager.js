import React from 'react';
import CreateFolderModal from '@/components/modules/Modals/CreateFolderModal';
import ShareModal from '@/components/modules/Modals/ShareModal/ShareModal';
import CreateFileModal from '@/components/modules/Modals/CreateFileModal/CreateFileModal';
import ShareSettingsModal from '@/components/modules/Modals/shareSettingsModal/ShareSettingsModal';
import EditPdfModal from '@/components/modules/Modals/editPdfModal/EditPdfModal';
import CreateSignatureModal from '@/components/modules/Modals/CreateSignatureModal/CreateSignatureModal';
import GetSignaturesModal from '@/components/modules/Modals/GetSignaturesModal/GetSignaturesModal';
import SignYourselfModal from '@/components/modules/Modals/SignYourselfModal/SignYourselfModal';
import CreateTemplateModal from '@/components/modules/Modals/CreateTemplateModal/CreateTemplateModal';
import FileRequest from '@/components/modules/Modals/FileRequestModal/FileRequest';
import ShareFileRequest from '@/components/modules/Modals/FileRequestModal/ShareFileRequest';
import DeletePermanentModal from '@/components/modules/Modals/DeletedFiles/DeletePermanentModal/DeletePermanentModal';
import CreateTransferModal from '@/components/modules/Modals/CreateTransferModal/CreateTransferModal';
import UploadFileModal from '@/components/modules/Modals/UploadFileModal/UploadFileModal';
import RenameModal from '@/components/modules/Modals/RenameModal/RenameModal';
import InfoModal from '@/components/modules/Modals/InfoModal/InfoModal';
import OpenInModal from '@/components/modules/Modals/OpenInModal/OpenInModal';
import CopyFileModal from '@/components/modules/Modals/CopyFileModal/CopyFileModal';
import CopyFolderModal from '@/components/modules/Modals/CopyFolderModal/CopyFolderModal';
import MoveModal from '@/components/modules/Modals/MoveModal/MoveModal';


const ModalManager = () => {
  return (
    <>
      <CreateFolderModal />
      <ShareModal />
      <CreateFileModal />
      <ShareSettingsModal />
      <EditPdfModal />
      <CreateSignatureModal />
      <GetSignaturesModal />
      <SignYourselfModal />
      <CreateTemplateModal />
      <FileRequest />
      <ShareFileRequest />
      <DeletePermanentModal />
      <CreateTransferModal />
      <UploadFileModal />
      <RenameModal />
      <InfoModal />
      <OpenInModal />
      <CopyFileModal />
      <CopyFolderModal />
      <MoveModal />
    </>
  );
};

export default ModalManager;