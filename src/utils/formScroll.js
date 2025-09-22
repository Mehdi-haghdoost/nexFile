import { useEffect } from 'react';

// Hook برای اسکرول خودکار به المنت هدف
export const useAutoScrollToElement = (
  dependencies,
  targetRef,
  containerRef,
  options = { delay: 150, behavior: 'smooth', block: 'end' }
) => {
  useEffect(() => {
    const shouldScroll = dependencies.some(dep => dep === true);
    
    if (shouldScroll && targetRef.current && containerRef.current) {
      setTimeout(() => {
        targetRef.current?.scrollIntoView({
          behavior: options.behavior,
          block: options.block
        });
      }, options.delay);
    }
  }, dependencies);
};

// تابع برای اسکرول دستی به المنت
export const scrollToElement = (
  targetRef,
  options = { behavior: 'smooth', block: 'end' }
) => {
  if (targetRef.current) {
    targetRef.current.scrollIntoView({
      behavior: options.behavior,
      block: options.block
    });
  }
};

// Hook برای اسکرول به انتهای فرم وقتی فیلدهای جدید اضافه می‌شوند
export const useFormAutoScroll = (
  formStates,
  formActionsRef,
  modalContentRef,
  delay = 150
) => {
  useEffect(() => {
    const hasActiveStates = Object.values(formStates).some(state => state === true);
    
    if (hasActiveStates && formActionsRef.current && modalContentRef.current) {
      setTimeout(() => {
        formActionsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end' 
        });
      }, delay);
    }
  }, [formStates.hasPassword, formStates.hasDeadline, delay]);
};

// تابع برای تنظیم کلاس‌های CSS اسکرول مدال
export const getScrollableModalClasses = (maxHeight = '90vh') => ({
  container: `w-full max-h-[${maxHeight}] overflow-hidden`,
  content: `flex flex-col justify-center items-start gap-12 p-6 flex-shrink-0 rounded-lg border border-neutral-50 bg-white max-h-[${maxHeight}] overflow-y-auto`
});

// اعتبارسنجی فرم FileRequest
export const validateFileRequestForm = ({
  title,
  description,
  selectedFolder,
  hasDeadline,
  deadlineDate,
  hasPassword,
  password,
  confirmPassword
}) => {
  const basicValid = title.trim() !== '' && description.trim() !== '' && selectedFolder;
  const deadlineValid = !hasDeadline || (hasDeadline && deadlineDate);
  const passwordValid = !hasPassword || (
    hasPassword && 
    password && 
    confirmPassword && 
    password === confirmPassword && 
    password.length >= 6
  );
  
  return basicValid && deadlineValid && passwordValid;
};

// آماده‌سازی داده‌های deadline
export const prepareDeadlineData = (hasDeadline, deadlineDate, deadlineTime) => {
  if (!hasDeadline || !deadlineDate) {
    return null;
  }

  return {
    date: deadlineDate,
    time: deadlineTime || '23:59',
    fullDateTime: new Date(`${deadlineDate}T${deadlineTime || '23:59'}`).toISOString()
  };
};

// آماده‌سازی داده‌های password
export const preparePasswordData = (hasPassword, password) => {
  if (!hasPassword || !password) {
    return null;
  }

  return {
    password: password,
    hasPassword: true
  };
};

// آماده‌سازی کامل داده‌های درخواست
export const prepareFileRequestData = ({
  title,
  description,
  selectedFolder,
  hasDeadline,
  deadlineDate,
  deadlineTime,
  hasPassword,
  password
}) => {
  const deadline = prepareDeadlineData(hasDeadline, deadlineDate, deadlineTime);
  const passwordData = preparePasswordData(hasPassword, password);

  return {
    title: title.trim(),
    description: description.trim(),
    selectedFolder: selectedFolder,
    folderId: selectedFolder.id,
    folderName: selectedFolder.name,
    folderPath: selectedFolder.path,
    hasDeadline,
    deadline,
    hasPassword,
    passwordData,
    createdAt: new Date().toISOString()
  };
};

// بازنشانی تمام state های فرم
export const resetFormState = (setters) => {
  const {
    setTitle,
    setDescription,
    setHasDeadline,
    setHasPassword,
    setDeadlineDate,
    setDeadlineTime,
    setPassword,
    setConfirmPassword,
    setSelectedFolder
  } = setters;

  setTitle('');
  setDescription('');
  setHasDeadline(false);
  setHasPassword(false);
  setDeadlineDate('');
  setDeadlineTime('');
  setPassword('');
  setConfirmPassword('');
  setSelectedFolder(null);
};