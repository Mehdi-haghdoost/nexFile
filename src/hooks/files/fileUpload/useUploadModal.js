import { useState, useRef } from 'react';

export const useUploadModal = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const addFiles = (files) => {
    const newFiles = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: formatFileSize(file.size),
      folderPath: file.folderPath || '',
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    
    const filesWithPath = files.map(file => {
      let folderPath = '';
      
      if (file.webkitRelativePath) {
        const parts = file.webkitRelativePath.split('/');
        if (parts.length > 1) {
          folderPath = parts.slice(0, -1).join('/');
        }
      }
      
      return Object.assign(file, { folderPath });
    });
    
    const validFiles = filesWithPath.filter(f => f.size > 0);
    addFiles(validFiles);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const traverseFileTree = async (item, filesList, path = '') => {
    if (item.isFile) {
      return new Promise((resolve) => {
        item.file((file) => {
          Object.assign(file, { folderPath: path });
          filesList.push(file);
          resolve();
        }, () => resolve());
      });
    } else if (item.isDirectory) {
      const dirReader = item.createReader();
      
      return new Promise((resolve) => {
        dirReader.readEntries(async (entries) => {
          for (const entry of entries) {
            await traverseFileTree(entry, filesList, path + item.name + '/');
          }
          resolve();
        }, () => resolve());
      });
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = Array.from(e.dataTransfer.items || []);
    const files = [];

    if (items.length > 0 && items[0].webkitGetAsEntry) {
      for (const item of items) {
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            await traverseFileTree(entry, files, '');
          }
        }
      }
    } else {
      const droppedFiles = Array.from(e.dataTransfer.files || []);
      droppedFiles.forEach(file => {
        Object.assign(file, { folderPath: '' });
        files.push(file);
      });
    }

    const validFiles = files.filter(f => f.size > 0);
    
    if (validFiles.length > 0) {
      addFiles(validFiles);
    }
  };

  return {
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
  };
};