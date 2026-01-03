"use client";
import React, { useEffect } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import useModalStore from '@/store/ui/modalStore';
import useFilesStore from '@/store/features/files/filesStore';
import { useUploadFile } from '@/hooks/files/fileUpload/useUploadFile';
import { useUploadModal } from '@/hooks/files/fileUpload/useUploadModal';

const UploadFileModal = () => {
  const { isModalOpen, closeModal } = useModalStore();
  const { uploadingFiles } = useFilesStore();
  const { uploadMultipleFiles, isUploading } = useUploadFile();
  const {
    selectedFiles,
    isDragging,
    fileInputRef,
    folderInputRef,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    removeFile,
    clearFiles,
  } = useUploadModal();

  const isOpen = isModalOpen('uploadFile');

  useEffect(() => {
    if (!isOpen) {
      clearFiles();
    }
  }, [isOpen, clearFiles]);

  const handleClose = () => {
    if (!isUploading) {
      closeModal('uploadFile');
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const files = selectedFiles.map(f => ({
      file: f.file,
      folderPath: f.folderPath || ''
    }));
    
    await uploadMultipleFiles(files);
    closeModal('uploadFile');
  };

  const displayFiles = [
    ...selectedFiles,
    ...uploadingFiles.map(uf => ({
      id: uf.id,
      name: uf.name,
      size: uf.size,
      progress: uf.progress,
      status: uf.status,
      folderPath: uf.folderPath,
      isUploading: true
    }))
  ];

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} width="600px">
      <div className="w-full dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-primary-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" className="sm:w-[18px] sm:h-[18px]">
                <path d="M18.3333 12.5V13.5C18.3333 14.9001 18.3333 15.6002 18.0608 16.135C17.8211 16.6054 17.4387 16.9878 16.9683 17.2275C16.4335 17.5 15.7334 17.5 14.3333 17.5H7.33331C5.93318 17.5 5.23312 17.5 4.69834 17.2275C4.22793 16.9878 3.84548 16.6054 3.6058 16.135C3.33331 15.6002 3.33331 14.9001 3.33331 13.5V12.5M15 6.66667L10.8333 2.5M10.8333 2.5L6.66665 6.66667M10.8333 2.5V12.5" stroke="#4C3CC6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-white" />
              </svg>
            </div>
            <h2 className="text-base sm:text-lg font-medium text-neutral-500 dark:text-white">Upload Files</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none" className="sm:w-5 sm:h-5">
              <path d="M5 5L15 15M5 15L15 5" stroke="#737379" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-neutral-300" />
            </svg>
          </button>
        </div>

        {/* Drag & Drop Area */}
        <div
          className={`mb-4 sm:mb-6 border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
              : 'border-gray-300 dark:border-neutral-600 hover:border-blue-400 dark:hover:border-blue-500'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <input
            ref={folderInputRef}
            type="file"
            webkitdirectory=""
            directory=""
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" className="w-10 h-10 sm:w-12 sm:h-12">
              <path d="M44 30V32.4C44 35.7603 44 37.4405 43.346 38.718C42.7708 39.8534 41.8534 40.7708 40.718 41.346C39.4405 42 37.7603 42 34.4 42H17.6C14.2397 42 12.5595 42 11.282 41.346C10.1466 40.7708 9.22919 39.8534 8.65396 38.718C8 37.4405 8 35.7603 8 32.4V30M36 16L26 6M26 6L16 16M26 6V30" stroke="#9E9EA7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-neutral-400" />
            </svg>

            <div>
              <p className="text-sm sm:text-base font-medium text-neutral-500 dark:text-white mb-1">
                Drag and drop files or folders here
              </p>
              <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-300 mb-3">
                Or click below to browse
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Files
                </button>
                <button
                  type="button"
                  onClick={() => folderInputRef.current?.click()}
                  className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  Browse Folders
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Selected/Uploading Files List */}
        {displayFiles.length > 0 && (
          <div className="mb-4 sm:mb-6 max-h-[300px] overflow-y-auto custom-scrollbar">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-white mb-3">
              {uploadingFiles.length > 0 ? `Uploading (${uploadingFiles.length})` : `Selected Files (${selectedFiles.length})`}
            </h3>
            <div className="space-y-2">
              {displayFiles.map((fileItem) => (
                <div
                  key={fileItem.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800"
                >
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="#4C3CC6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-blue-400" />
                      <path d="M13 2V9H20" stroke="#4C3CC6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-blue-400" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-500 dark:text-white truncate">
                      {fileItem.folderPath && (
                        <span className="text-xs text-neutral-400 dark:text-neutral-300 mr-1">
                          {fileItem.folderPath}/
                        </span>
                      )}
                      {fileItem.name}
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-300">
                      {fileItem.size}
                    </p>

                    {fileItem.isUploading && fileItem.status === 'uploading' && (
                      <div className="mt-2">
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                            style={{ width: `${fileItem.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-neutral-400 dark:text-neutral-300 mt-1">
                          {fileItem.progress}%
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {fileItem.status === 'completed' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : fileItem.status === 'uploading' ? (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : fileItem.status === 'error' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 6V10M10 14H10.01M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <button
                        onClick={() => removeFile(fileItem.id)}
                        disabled={isUploading}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded transition-colors disabled:opacity-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 4L12 12M4 12L12 4" stroke="#737379" strokeWidth="1.5" strokeLinecap="round" className="dark:stroke-neutral-400" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-neutral-700">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-sm font-medium text-neutral-500 dark:text-white bg-white border border-gray-300 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-dark-gradient dark:shadow-dark-panel"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isUploading && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}`}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default UploadFileModal;