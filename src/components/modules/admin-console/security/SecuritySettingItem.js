'use client';
import React from 'react';
import { Switch } from '@/components/ui/Switch';

const SecuritySettingItem = ({ setting, onToggle, onChangeOption, onAction }) => {
    const {
        id,
        title,
        description,
        type,
        actionText,
        status,
        options,
        currentOption,
        disabled,
        hint,
    } = setting;

    return (
        <article className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 self-stretch border-b border-stroke-200 dark:border-neutral-700 pb-3 last:border-b-0 w-full">
            <div className="flex flex-1 flex-col justify-center items-start gap-1 min-w-0 w-full sm:w-auto">
                <h3 className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-white">{title}</h3>
                <p className="text-xs text-neutral-300 dark:text-neutral-200">{description}</p>
                {hint && (
                    <p className="text-xs text-neutral-400 dark:text-neutral-300 mt-0.5">{hint}</p>
                )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                {type === 'button' && (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => onAction?.(id)}
                        className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        {actionText}
                    </button>
                )}

                {type === 'switch' && (
                    <>
                        <span className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-white mr-1">
                            {status ? 'on' : 'off'}
                        </span>
                        <Switch
                            id={id}
                            checked={status}
                            disabled={disabled}
                            onChange={(value) => onToggle?.(id, value)}
                        />
                    </>
                )}

                {type === 'dropdown' && (
                    <select
                        disabled={disabled}
                        className="flex items-center h-9 sm:h-8 gap-1.5 py-1.5 sm:py-1 px-3 rounded-lg border border-stroke-300 bg-white shadow-light text-xs sm:text-sm font-medium text-neutral-500 dark:text-white cursor-pointer focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel w-full sm:w-auto min-w-[140px] [&>option]:bg-white [&>option]:dark:bg-neutral-800 [&>option]:text-neutral-500 [&>option]:dark:text-white"
                        value={currentOption}
                        onChange={(e) => onChangeOption?.(id, e.target.value)}
                    >
                        {options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                )}
            </div>
        </article>
    );
};

export default SecuritySettingItem;