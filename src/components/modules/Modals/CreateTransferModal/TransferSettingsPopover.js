"use client";

import React, { useEffect, useRef } from 'react';
import { CalendarDateIcon, EyeOffIcon, EyeOnIcon, KeyIcon } from '@/components/ui/icons';
import { Switch } from '@/components/ui/Switch';
import {
    TRANSFER_EXPIRY_OPTIONS,
    TRANSFER_MIN_PASSWORD_LENGTH,
} from '@/utils/constants/transferConstants';

const TransferSettingsPopover = ({
    expiresInDays,
    onExpiryChange,
    isPasswordEnabled,
    onPasswordEnabledChange,
    password,
    onPasswordChange,
    isPasswordVisible,
    onPasswordVisibilityToggle,
    onClose,
}) => {
    const popoverRef = useRef(null);
    const passwordInputRef = useRef(null);

    // Closes on an outside click or Escape, like the other dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                onClose?.();
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose?.();
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Enabling the toggle should land the caret in the field straight away
    useEffect(() => {
        if (isPasswordEnabled) passwordInputRef.current?.focus();
    }, [isPasswordEnabled]);

    const isPasswordTooShort =
        isPasswordEnabled &&
        password.length > 0 &&
        password.length < TRANSFER_MIN_PASSWORD_LENGTH;

    return (
        <div
            ref={popoverRef}
            // Opens upward because the trigger sits in the modal footer
            className="absolute bottom-full left-0 z-50 mb-2 w-72 rounded-xl border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 shadow-dropdown dark:shadow-dark-dropdown"
        >
            {/* Expiry */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <CalendarDateIcon />
                    <span className="text-sm font-medium text-neutral-500 dark:text-white">
                        Link expires after
                    </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                    {TRANSFER_EXPIRY_OPTIONS.map((option) => (
                        <button
                            key={option.days}
                            type="button"
                            onClick={() => onExpiryChange(option.days)}
                            className={`
                                rounded-lg border py-1.5 text-xs font-medium transition-colors
                                ${expiresInDays === option.days
                                    ? 'border-primary-500 bg-primary-50 text-primary-500 dark:bg-primary-bg dark:text-white'
                                    : 'border-stroke-300 dark:border-dark-border text-neutral-400 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-dark-overlay'
                                }
                            `}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="my-4 h-px w-full bg-stroke-200 dark:bg-neutral-700" />

            {/* Password */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <KeyIcon />
                    <span className="flex-1 text-sm font-medium text-neutral-500 dark:text-white">
                        Require a password
                    </span>
                    <Switch
                        checked={isPasswordEnabled}
                        onChange={() => onPasswordEnabledChange(!isPasswordEnabled)}
                    />
                </div>

                {isPasswordEnabled && (
                    <>
                        <div className="flex items-center gap-2 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-neutral-900 px-3 py-2 focus-within:border-primary-500">
                            <input
                                ref={passwordInputRef}
                                type={isPasswordVisible ? 'text' : 'password'}
                                value={password}
                                placeholder="Enter a password"
                                autoComplete="new-password"
                                onChange={(event) => onPasswordChange(event.target.value)}
                                className="flex-1 min-w-0 bg-transparent text-sm text-neutral-500 dark:text-white outline-none"
                            />
                            <button
                                type="button"
                                onClick={onPasswordVisibilityToggle}
                                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                                className="shrink-0 hover:opacity-70 transition-opacity"
                            >
                                {isPasswordVisible ? <EyeOffIcon /> : <EyeOnIcon />}
                            </button>
                        </div>

                        <p className={`text-xs ${isPasswordTooShort ? 'text-error-400' : 'text-neutral-300 dark:text-neutral-400'}`}>
                            At least {TRANSFER_MIN_PASSWORD_LENGTH} characters. Share it separately from the link.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default TransferSettingsPopover;