"use client";

import React, { useEffect, useRef, useState } from 'react';

const ToolInputDialog = ({
    title = 'Enter a value',
    label = '',
    placeholder = '',
    confirmText = 'Insert',
    onConfirm,
    onCancel,
}) => {
    const [value, setValue] = useState('');
    const inputRef = useRef(null);

    // Focus the field as soon as the dialog appears
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Escape closes the dialog from anywhere on the page
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onCancel?.();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    const handleConfirm = () => {
        const trimmed = value.trim();
        if (!trimmed) return;
        onConfirm?.(trimmed);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
            <div
                className="w-full max-w-sm rounded-xl bg-white dark:bg-neutral-800 p-5 shadow-dropdown dark:shadow-dark-dropdown"
                onClick={(event) => event.stopPropagation()}
            >
                <h3 className="text-base font-medium text-neutral-500 dark:text-white">
                    {title}
                </h3>

                {label && (
                    <label className="mt-3 block text-xs text-neutral-300 dark:text-neutral-400">
                        {label}
                    </label>
                )}

                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    dir="auto"
                    placeholder={placeholder}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && handleConfirm()}
                    className="mt-1.5 w-full rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-500 dark:text-white outline-none focus:border-primary-500"
                />

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-stroke-300 dark:border-dark-border px-4 py-2 text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!value.trim()}
                        className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ToolInputDialog;