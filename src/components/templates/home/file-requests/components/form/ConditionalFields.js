import React from 'react';
import ToggleOption from '@/components/templates/home/file-requests/inputs/ToggleOption';
import DeadlinePicker from '@/components/templates/home/file-requests/inputs/DeadlinePicker';
import PasswordInput from '@/components/templates/home/file-requests/inputs/PasswordInput';

const ConditionalFields = ({
  hasDeadline, 
  hasPassword, 
  handlers,
  deadlineDate, 
  deadlineTime,
  password,
  confirmPassword
}) => (
  <>
    <ToggleOption
      label='Set a deadline'
      id='toggle-deadline'
      checked={hasDeadline}
      onChange={handlers.deadline.onToggle}
    />

    {hasDeadline && (
      <DeadlinePicker
        selectedDate={deadlineDate}
        selectedTime={deadlineTime}
        onDateChange={handlers.deadline.onDateChange}
        onTimeChange={handlers.deadline.onTimeChange}
      />
    )}

    <ToggleOption
      label='Password'
      id='toggle-password'
      checked={hasPassword}
      onChange={handlers.password.onToggle}
    />

    {hasPassword && (
      <PasswordInput
        password={password}
        confirmPassword={confirmPassword}
        onPasswordChange={handlers.password.onPasswordChange}
        onConfirmPasswordChange={handlers.password.onConfirmPasswordChange}
        showStrength={true}
      />
    )}
  </>
);

export default ConditionalFields;