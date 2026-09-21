import { useState } from 'react';

const useTransferFiles = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  // Turns local File objects into entries that will be uploaded
  const processFiles = (fileList) => {
    const batchId = Date.now();

    const processedFiles = fileList.map((file, index) => ({
      id: `upload-${batchId}-${index}`,
      source: 'upload',
      fileId: null,
      name: file.name,
      size: formatFileSize(file.size),
      bytes: file.size,
      mimeType: file.type,
      extension: getFileExtension(file.name),
      file,
    }));

    setFiles((prev) => [...prev, ...processedFiles]);
  };

  // Adds stored NexFile files, skipping any already in the transfer
  const addLibraryFiles = (libraryFiles) => {
    setFiles((prev) => {
      const existingIds = new Set(prev.map((entry) => entry.fileId).filter(Boolean));

      const additions = libraryFiles
        .filter((file) => !existingIds.has(file.id))
        .map((file) => ({
          id: `library-${file.id}`,
          source: 'library',
          fileId: file.id,
          name: file.name,
          size: formatFileSize(file.size),
          bytes: file.size,
          mimeType: file.mimeType,
          extension: file.extension || getFileExtension(file.name),
          file: null,
        }));

      return [...prev, ...additions];
    });
  };

  const removeFile = (entryId) => {
    setFiles((prev) => prev.filter((entry) => entry.id !== entryId));
  };

  const clearFiles = () => {
    setFiles([]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileSelect = (e) => {
    processFiles(Array.from(e.target.files));

    // Clears the input so choosing the same file again still fires a change
    e.target.value = '';
  };

  return {
    files,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    addLibraryFiles,
    removeFile,
    clearFiles,
  };
};

export default useTransferFiles;