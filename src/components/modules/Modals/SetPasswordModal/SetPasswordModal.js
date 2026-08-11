'use client';
import React, { useState, useEffect, useMemo } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import useModalStore from '@/store/ui/modalStore';
import PasswordRequirements from '@/components/ui/PasswordRequirements';
import PasswordStrengthIndicator from '@/components/ui/PasswordStrengthIndicator';
import { validateField, validatePassword } from '@/utils/auth/validators';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

const inputBase =
    'w-full h-10 px-3 pr-10 rounded-lg border bg-white text-sm text-neutral-500 focus:outline-none dark:bg-neutral-800 dark:text-white transition-colors';

const EyeIcon = ({ visible }) => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {visible ? (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
        ) : (
            <>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
            </>
        )}
    </svg>
);

const SetPasswordModal = () => {
    const { isOpen, data } = useModalStore((state) => state.modals.setPassword);
    const closeModal = useModalStore((state) => state.closeModal);

    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [visible, setVisible] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasPassword = Boolean(data?.hasPassword);

    // Clear credentials once the modal closes
    useEffect(() => {
        if (!isOpen) {
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setErrors({});
            setTouched({});
            setVisible({});
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const isFormValid = useMemo(() => {
        if (hasPassword && !form.currentPassword) return false;
        if (!validatePassword(form.newPassword).isValid) return false;
        if (form.newPassword !== form.confirmPassword) return false;
        return true;
    }, [form, hasPassword]);

    const handleChange = (field, value) => {
        const next = { ...form, [field]: value };
        setForm(next);

        if (!touched[field]) return;

        // Same rules as the registration form, via the shared validator.
        const fieldName = field === 'newPassword' ? 'password' : field;
        const allData = { password: next.newPassword };

        if (field === 'confirmPassword') {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: validateField('confirmPassword', value, allData),
            }));
        } else if (field === 'newPassword') {
            setErrors((prev) => ({
                ...prev,
                newPassword: validateField('password', value),
                // Re-check the confirmation against the new value
                confirmPassword: next.confirmPassword
                    ? validateField('confirmPassword', next.confirmPassword, allData)
                    : prev.confirmPassword,
            }));
        } else {
            setErrors((prev) => ({ ...prev, [fieldName]: null }));
        }
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));

        if (field === 'newPassword') {
            setErrors((prev) => ({
                ...prev,
                newPassword: validateField('password', form.newPassword),
            }));
        } else if (field === 'confirmPassword') {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: validateField('confirmPassword', form.confirmPassword, {
                    password: form.newPassword,
                }),
            }));
        } else if (field === 'currentPassword' && !form.currentPassword) {
            setErrors((prev) => ({ ...prev, currentPassword: 'Current password is required' }));
        }
    };

    const handleClose = () => closeModal('setPassword');

    const handleSubmit = async () => {
        setTouched({ currentPassword: true, newPassword: true, confirmPassword: true });

        const nextErrors = {
            currentPassword:
                hasPassword && !form.currentPassword ? 'Current password is required' : null,
            newPassword: validateField('password', form.newPassword),
            confirmPassword: validateField('confirmPassword', form.confirmPassword, {
                password: form.newPassword,
            }),
        };

        setErrors(nextErrors);

        if (Object.values(nextErrors).some(Boolean)) return;

        setIsSubmitting(true);
        const result = await data?.onSubmit?.({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
            confirmPassword: form.confirmPassword,
        });
        setIsSubmitting(false);

        if (result?.success) {
            showSuccessToast(result.message || 'Password updated');
            handleClose();
        } else {
            showErrorToast(result?.message || 'Failed to update password');
        }
    };

    const renderField = (field, placeholder, autoComplete) => {
        const hasError = touched[field] && errors[field];

        return (
            <div className="flex flex-col gap-1">
                <div className="relative">
                    <input
                        type={visible[field] ? 'text' : 'password'}
                        className={`${inputBase} ${
                            hasError
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-stroke-300 focus:border-blue-500 dark:border-neutral-700'
                        }`}
                        placeholder={placeholder}
                        value={form[field]}
                        onChange={(e) => handleChange(field, e.target.value)}
                        onBlur={() => handleBlur(field)}
                        autoComplete={autoComplete}
                    />
                    <button
                        type="button"
                        onClick={() => setVisible((prev) => ({ ...prev, [field]: !prev[field] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-500"
                        tabIndex={-1}
                    >
                        <EyeIcon visible={visible[field]} />
                    </button>
                </div>
                {hasError && <p className="text-xs text-red-500">{errors[field]}</p>}
            </div>
        );
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width="440px">
            <div className="flex max-h-[80vh] w-full flex-col gap-4 overflow-y-auto custom-scrollbar">
                <header className="flex flex-col gap-1">
                    <h2 className="text-base font-medium text-neutral-500 dark:text-white">
                        {hasPassword ? 'Change password' : 'Set password'}
                    </h2>
                    <p className="text-xs text-neutral-300 dark:text-neutral-200">
                        {hasPassword
                            ? 'You will stay signed in here. Other devices will be signed out.'
                            : 'Adds a password to your account alongside social sign-in.'}
                    </p>
                </header>

                <div className="flex flex-col gap-3">
                    {hasPassword &&
                        renderField('currentPassword', 'Current password', 'current-password')}

                    {renderField('newPassword', 'New password', 'new-password')}

                    {form.newPassword && (
                        <>
                            <PasswordStrengthIndicator password={form.newPassword} />
                            <PasswordRequirements password={form.newPassword} />
                        </>
                    )}

                    {renderField('confirmPassword', 'Confirm new password', 'new-password')}
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="h-9 rounded-lg px-4 text-sm font-medium text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 dark:text-white dark:hover:bg-neutral-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !isFormValid}
                        className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default SetPasswordModal;