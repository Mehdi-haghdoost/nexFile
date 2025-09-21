'use client';

import React, { useState, useEffect, useRef } from 'react';
import useModalStore from '@/store/modalStore';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import FormHeader from '@/components/templates/home/file-requests/FormHeader';
import TextInput from '@/components/templates/home/file-requests/TextInput';
import FolderSelector from '@/components/templates/home/file-requests/FolderSelector';
import ToggleOption from '@/components/templates/home/file-requests/ToggleOption';
import FormActions from '@/components/templates/home/file-requests/FormActions';
import PasswordInput from '@/components/templates/home/file-requests/PasswordInput';
import DeadlinePicker from '@/components/templates/home/file-requests/DeadlinePicker';
import { useFolders } from '@/hooks/createFileModal/useFolders';
import { 
  validateFileRequestForm, 
  prepareFileRequestData, 
  resetFormState 
} from '@/utils/formScroll';
import { 
  useFormAutoScroll,
  getScrollableModalClasses 
} from '@/utils/formScroll';

const FileRequest = () => {
  const { modals, closeModal } = useModalStore();
  const { isOpen, data } = modals.fileRequest;

  // وضعیت اصلی فرم
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hasDeadline, setHasDeadline] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // وضعیت deadline
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  
  // وضعیت password
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { folders, isLoading: isFoldersLoading, error: foldersError } = useFolders();
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Refs برای اسکرول
  const modalContentRef = useRef(null);
  const formActionsRef = useRef(null);

  // استفاده از scroll utility hook
  useFormAutoScroll(
    { hasPassword, hasDeadline },
    formActionsRef,
    modalContentRef
  );

  // دریافت کلاس‌های CSS برای مدال قابل اسکرول
  const scrollClasses = getScrollableModalClasses('90vh');

  // تنظیم فولدر پیش‌فرض
  useEffect(() => {
    if (folders.length > 0 && !selectedFolder) {
      const defaultFolder = folders.find(f => f.name === 'Campaign Design') || folders[0];
      setSelectedFolder(defaultFolder);
    }
  }, [folders, selectedFolder]);

  // اعتبارسنجی فرم با استفاده از utility function
  const isFormValid = () => {
    return validateFileRequestForm({
      title,
      description,
      selectedFolder,
      hasDeadline,
      deadlineDate,
      hasPassword,
      password,
      confirmPassword
    });
  };

  const handleClose = () => {
    // بازنشانی تمام state ها با استفاده از utility function
    resetFormState({
      setTitle,
      setDescription,
      setHasDeadline,
      setHasPassword,
      setDeadlineDate,
      setDeadlineTime,
      setPassword,
      setConfirmPassword,
      setSelectedFolder
    });
    closeModal('fileRequest');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      console.warn('Form is not valid');
      return;
    }

    setIsLoading(true);

    try {
      // آماده‌سازی داده‌ها با استفاده از utility function
      const requestData = prepareFileRequestData({
        title,
        description,
        selectedFolder,
        hasDeadline,
        deadlineDate,
        deadlineTime,
        hasPassword,
        password
      });

      console.log('Form Submitted!', requestData);

      // در اینجا منطق ارسال داده به سرور را پیاده سازی کنید
      // const response = await fetch('/api/file-requests', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(requestData),
      // });

      // شبیه‌سازی تاخیر شبکه
      await new Promise(resolve => setTimeout(resolve, 1000));

      // پس از موفقیت، فرم را ببندید
      handleClose();

    } catch (error) {
      console.error('Failed to create request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder);
    console.log('Selected folder:', folder);
  };

  // تابع‌های کمکی برای deadline
  const handleDeadlineDateChange = (date) => {
    setDeadlineDate(date);
  };

  const handleDeadlineTimeChange = (time) => {
    setDeadlineTime(time);
  };

  // تابع‌های کمکی برای password
  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword);
  };

  const handleConfirmPasswordChange = (newConfirmPassword) => {
    setConfirmPassword(newConfirmPassword);
  };

  // تابع toggle برای deadline
  const handleDeadlineToggle = () => {
    setHasDeadline(!hasDeadline);
    if (hasDeadline) {
      setDeadlineDate('');
      setDeadlineTime('');
    }
  };

  // تابع toggle برای password
  const handlePasswordToggle = () => {
    setHasPassword(!hasPassword);
    if (hasPassword) {
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} width='600px'>
      <div className={scrollClasses.container}>
        <div 
          ref={modalContentRef}
          className={scrollClasses.content}
        >
          <form className='flex flex-col items-start gap-6 self-stretch' onSubmit={handleSubmit}>
            <FormHeader onClose={handleClose} />
            
            <div className='flex flex-col items-start gap-5 self-stretch'>
              <div className='flex flex-col items-start gap-4 self-stretch'>
                <TextInput 
                  label='Title' 
                  id='request-title' 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Enter request title...'
                  required
                />
                
                <TextInput 
                  label='Description' 
                  id='request-description' 
                  isTextarea={true} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Enter request description...'
                  required
                />
                
                {isFoldersLoading ? (
                  <div className='flex items-center justify-center py-4'>
                    <div className='text-regular-14 text-gray-500'>Loading folders...</div>
                  </div>
                ) : foldersError ? (
                  <div className='flex items-center justify-center py-4'>
                    <div className='text-regular-14 text-red-500'>
                      Error loading folders: {foldersError}
                    </div>
                  </div>
                ) : (
                  <FolderSelector 
                    folders={folders}
                    selectedFolder={selectedFolder}
                    onSelectFolder={handleFolderSelect}
                  />
                )}
              </div>
              
              {/* Deadline Toggle و Input */}
              <ToggleOption 
                label='Set a deadline' 
                id='toggle-deadline' 
                checked={hasDeadline} 
                onChange={handleDeadlineToggle} 
              />
              
              {/* نمایش DeadlinePicker زمانی که deadline فعال است */}
              {hasDeadline && (
                <DeadlinePicker
                  onDateChange={handleDeadlineDateChange}
                  onTimeChange={handleDeadlineTimeChange}
                  initialDate={deadlineDate}
                  initialTime={deadlineTime}
                />
              )}
              
              {/* Password Toggle و Input */}
              <ToggleOption 
                label='Password' 
                id='toggle-password' 
                checked={hasPassword} 
                onChange={handlePasswordToggle} 
              />
              
              {/* نمایش PasswordInput زمانی که password فعال است */}
              {hasPassword && (
                <PasswordInput
                  onPasswordChange={handlePasswordChange}
                  onConfirmPasswordChange={handleConfirmPasswordChange}
                  showStrength={true}
                />
              )}
            </div>
            
            <div ref={formActionsRef}>
              <FormActions 
                onCancel={handleClose} 
                isLoading={isLoading} 
                isFormValid={isFormValid()} 
              />
            </div>
          </form>
        </div>
      </div>
    </BaseModal>
  );
};

export default FileRequest;