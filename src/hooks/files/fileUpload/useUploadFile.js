"use client";
import { useState } from 'react';
import Swal from 'sweetalert2';
import useFilesStore from '@/store/features/files/filesStore';
import useFoldersStore from '@/store/features/folders/foldersStore';
import { api } from '@/lib/fetchWithAuth';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export const useUploadFile = () => {
  const [isUploading, setIsUploading] = useState(false);
  const {
    addUploadingFile,
    updateUploadingFile,
    removeUploadingFile,
    addFile,
    clearUploadingFiles,
    fetchFiles
  } = useFilesStore();

  const { folders, addFolder, fetchFolders } = useFoldersStore();

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`;
  };


  const findOrCreateFolder = async (folderPath) => {
    if (!folderPath) return { folderId: null, wasCreated: false };

    const parts = folderPath.split('/').filter(Boolean);
    let parentId = null;
    let createdAny = false;

    for (const name of parts) {
      const existing = folders.find(f => f.name === name && f.parentFolder === parentId);

      if (existing) {
        parentId = existing.id;
        continue;
      }

      const response = await api.post('/api/folders', {
        name,
        parentFolder: parentId,
        accessType: 'regular',
      });

      const data = await response.json();


      if (!response.ok) throw new Error(data.message || 'Folder creation failed');
      if (!data.success || !data.folder) throw new Error('Invalid folder response');

      addFolder(data.folder);
      parentId = data.folder.id;
      createdAny = true;
    }

    return { folderId: parentId, wasCreated: createdAny };
  };

  const uploadSingleFile = async (fileData) => {
    const { file, folderPath = '' } = fileData;
    const fileId = Date.now().toString(36) + Math.random().toString(36).substr(2);

    addUploadingFile({
      id: fileId,
      file,
      name: file.name,
      size: formatFileSize(file.size),
      folderPath,
      progress: 0,
      status: 'pending',
    });

    try {
      updateUploadingFile(fileId, { status: 'uploading' });

      const { folderId, wasCreated } = await findOrCreateFolder(folderPath);

      const formData = new FormData();
      formData.append('file', file);
      if (folderId) formData.append('folder', folderId);

      // استفاده از api.upload و بعد .json()
      const response = await api.upload('/api/files/upload', formData);
      const data = await response.json(); // اضافه شد

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      updateUploadingFile(fileId, { progress: 100, status: 'completed' });
      addFile(data.file);

      setTimeout(() => removeUploadingFile(fileId), 500);

      return { success: true, file: data.file, folderCreated: wasCreated };
    } catch (error) {
      updateUploadingFile(fileId, { status: 'error', error: error.message });
      setTimeout(() => removeUploadingFile(fileId), 2000);
      return { success: false, error: error.message, folderCreated: false };
    }
  };

  const uploadMultipleFiles = async (files) => {
    if (!files?.length) {
      showErrorToast('Please select files to upload');
      return [];
    }

    const confirmed = await Swal.fire({
      title: 'Upload Files?',
      text: `Upload ${files.length} file${files.length > 1 ? 's' : ''}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, upload',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#4C3CC6',
      cancelButtonColor: '#6b7280',
      background: document.documentElement.classList.contains('dark') ? '#1E1E23' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
      customClass: { container: 'swal-high-z-index' }
    });

    if (!confirmed.isConfirmed) return [];

    setIsUploading(true);

    Swal.fire({
      title: `Uploading ${files.length} file${files.length > 1 ? 's' : ''}...`,
      html: `
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
          <div id="upload-progress-bar" class="bg-blue-600 h-2.5 rounded-full transition-all" style="width: 0%"></div>
        </div>
        <p id="upload-progress-text" class="text-sm text-gray-600 dark:text-gray-300 mt-2">0%</p>
      `,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: document.documentElement.classList.contains('dark') ? '#1E1E23' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
      customClass: { container: 'swal-high-z-index' }
    });

    const results = [];
    let foldersCreated = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const progress = Math.floor(((i + 1) / files.length) * 100);

        const progressBar = document.getElementById('upload-progress-bar');
        const progressText = document.getElementById('upload-progress-text');

        if (progressBar) {
          progressBar.style.width = `${progress}%`;
        }

        if (progressText) {
          progressText.textContent = `${progress}%`;
        }

        const result = await uploadSingleFile(files[i]);
        results.push(result);
        if (result.folderCreated) foldersCreated++;
      }

      const succeeded = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      Swal.close();
      await new Promise(resolve => setTimeout(resolve, 300));

      if (!failed) {
        if (foldersCreated) {
          showSuccessToast(`Uploaded ${succeeded} file${succeeded > 1 ? 's' : ''} and created ${foldersCreated} folder${foldersCreated > 1 ? 's' : ''}`);
        } else if (files.some(f => f.folderPath)) {
          showErrorToast('Folder already existed');
        } else {
          showSuccessToast(`Uploaded ${succeeded} file${succeeded > 1 ? 's' : ''}`);
        }
      } else if (!succeeded) {
        showErrorToast(`Failed to upload ${failed} file${failed > 1 ? 's' : ''}`);
      } else {
        showSuccessToast(`Uploaded ${succeeded} file${succeeded > 1 ? 's' : ''}, ${failed} failed`);
      }

      fetchFolders();
      fetchFiles();

    } catch (error) {
      Swal.close();
      showErrorToast(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      clearUploadingFiles();
    }

    return results;
  };

  return { uploadFile: uploadSingleFile, uploadMultipleFiles, isUploading };
};