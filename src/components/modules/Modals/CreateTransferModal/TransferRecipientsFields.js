"use client";

import React, { useState } from 'react';
import { CloseEmailIcon } from '@/components/ui/icons';
import { validateEmail } from '@/utils/auth/validators';
import {
    TRANSFER_MAX_MESSAGE_LENGTH,
    TRANSFER_MAX_RECIPIENTS,
} from '@/utils/constants/transferConstants';

// Characters that end one address and start the next
const SEPARATOR_PATTERN = /[\s,;]+/;

// Keys that turn the typed text into a recipient chip
const COMMIT_KEYS = ['Enter', ',', ';', ' '];

const TransferRecipientsFields = ({ recipients, onRecipientsChange, message, onMessageChange, disabled = false }) => {
    const [draft, setDraft] = useState('');
    const [error, setError] = useState('');

    const isFull = recipients.length >= TRANSFER_MAX_RECIPIENTS;

    // Turns typed or pasted text into recipients, keeping anything rejected in the field
    const commitDraft = (text) => {
        const candidates = text
            .split(SEPARATOR_PATTERN)
            .map((value) => value.trim().toLowerCase())
            .filter(Boolean);

        const next = [...recipients];
        const rejected = [];

        candidates.forEach((email) => {
            if (next.includes(email)) return;

            if (!validateEmail(email) || next.length >= TRANSFER_MAX_RECIPIENTS) {
                rejected.push(email);
                return;
            }

            next.push(email);
        });

        if (next.length !== recipients.length) onRecipientsChange(next);

        setDraft(rejected.join(' '));

        const hasInvalid = rejected.some((email) => !validateEmail(email));
        setError(
            hasInvalid
                ? 'Enter a valid email address'
                : rejected.length
                    ? `You can send to up to ${TRANSFER_MAX_RECIPIENTS} people`
                    : ''
        );
    };

    const handleKeyDown = (event) => {
        if (COMMIT_KEYS.includes(event.key) && draft.trim()) {
            event.preventDefault();
            commitDraft(draft);
        } else if (event.key === 'Backspace' && !draft && recipients.length) {
            onRecipientsChange(recipients.slice(0, -1));
        }
    };

    // A pasted list is split straight away; a single pasted address pastes normally
    const handlePaste = (event) => {
        const text = event.clipboardData.getData('text');
        if (!SEPARATOR_PATTERN.test(text.trim())) return;

        event.preventDefault();
        commitDraft(`${draft} ${text}`);
    };

    const removeRecipient = (email) => {
        onRecipientsChange(recipients.filter((item) => item !== email));
    };

    return (
        <div className='flex flex-col gap-3 w-full'>
            <div className='flex flex-col gap-1.5'>
                <label htmlFor='transfer-recipients' className='text-xs font-medium text-neutral-500 dark:text-neutral-300'>
                    Send to
                </label>

                <div className={`
                    flex flex-wrap items-center gap-1.5 min-h-[40px] max-h-24 overflow-y-auto custom-scrollbar px-2 py-1.5
                    rounded-lg border bg-white dark:bg-neutral-900
                    ${error ? 'border-error-400' : 'border-stroke-300 dark:border-dark-border focus-within:border-primary-500'}
                `}>
                    {recipients.map((email) => (
                        <span
                            key={email}
                            className='flex items-center gap-1.5 rounded-md bg-stroke-100 dark:bg-neutral-800 px-2 py-0.5 text-xs text-neutral-500 dark:text-white'
                        >
                            {email}
                            <button
                                type='button'
                                onClick={() => removeRecipient(email)}
                                disabled={disabled}
                                aria-label={`Remove ${email}`}
                                className='flex items-center hover:opacity-70 transition-opacity disabled:cursor-not-allowed'
                            >
                                <CloseEmailIcon />
                            </button>
                        </span>
                    ))}

                    {!isFull && (
                        <input
                            id='transfer-recipients'
                            type='text'
                            inputMode='email'
                            autoComplete='email'
                            value={draft}
                            disabled={disabled}
                            placeholder={recipients.length ? '' : 'name@example.com'}
                            onChange={(event) => {
                                setDraft(event.target.value);
                                if (error) setError('');
                            }}
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                            onBlur={() => draft.trim() && commitDraft(draft)}
                            className='flex-1 min-w-[140px] bg-transparent text-sm text-neutral-500 dark:text-white outline-none'
                        />
                    )}
                </div>

                <p className={`text-xs ${error ? 'text-error-400' : 'text-neutral-300 dark:text-neutral-400'}`}>
                    {error || `Press Enter or comma after each address · ${recipients.length}/${TRANSFER_MAX_RECIPIENTS}`}
                </p>
            </div>

            <div className='flex flex-col gap-1.5'>
                <label htmlFor='transfer-message' className='text-xs font-medium text-neutral-500 dark:text-neutral-300'>
                    Message <span className='font-normal text-neutral-300 dark:text-neutral-400'>(optional)</span>
                </label>

                <textarea
                    id='transfer-message'
                    rows={2}
                    dir='auto'
                    value={message}
                    disabled={disabled}
                    maxLength={TRANSFER_MAX_MESSAGE_LENGTH}
                    placeholder='Add a note for your recipients'
                    onChange={(event) => onMessageChange(event.target.value)}
                    className='w-full resize-none rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-500 dark:text-white outline-none focus:border-primary-500'
                />

                <p className='text-right text-[11px] text-neutral-300 dark:text-neutral-500'>
                    {message.length}/{TRANSFER_MAX_MESSAGE_LENGTH}
                </p>
            </div>
        </div>
    );
};

export default TransferRecipientsFields;