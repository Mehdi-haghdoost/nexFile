import { useState } from 'react';
import { validateFileRequestForm, resetFormState } from '@/utils/formScroll';

export const useFileRequestForm = () => {
  // تمام state ها
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hasDeadline, setHasDeadline] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);

  // تمام handlers
  const handleDeadlineToggle = () => {
    setHasDeadline(!hasDeadline);
    if (hasDeadline) {
      setDeadlineDate('');
      setDeadlineTime('');
    }
  };

  const handlePasswordToggle = () => {
    setHasPassword(!hasPassword);
    if (hasPassword) {
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handlers = {
    deadline: {
      onDateChange: setDeadlineDate,
      onTimeChange: setDeadlineTime,
      onToggle: handleDeadlineToggle
    },
    password: {
      onPasswordChange: setPassword,
      onConfirmPasswordChange: setConfirmPassword,
      onToggle: handlePasswordToggle
    },
    folder: {
      onSelect: setSelectedFolder
    }
  };

  const formData = {
    title, description, hasDeadline, hasPassword,
    deadlineDate, deadlineTime, password, confirmPassword, selectedFolder
  };

  const setters = {
    setTitle, setDescription, setHasDeadline, setHasPassword,
    setDeadlineDate, setDeadlineTime, setPassword, setConfirmPassword, setSelectedFolder
  };

  const isFormValid = () => validateFileRequestForm(formData);

  const resetForm = () => resetFormState(setters);

  return {
    formData,
    setters,
    handlers,
    isFormValid,
    resetForm
  };
};