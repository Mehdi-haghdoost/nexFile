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
  // اعتبارسنجی پایه
  const basicValid = title.trim() !== '' && description.trim() !== '' && selectedFolder;
  
  // اعتبارسنجی deadline
  const deadlineValid = !hasDeadline || (hasDeadline && deadlineDate);
  
  // اعتبارسنجی password
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