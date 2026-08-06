'use client';
import React from 'react';
import { Switch } from '@/components/ui/Switch';

const SecuritySettingItem = ({ setting, onToggle, onChangeOption }) => {
    const { id, title, description, type, actionText, status, options, currentOption } = setting;

    return (
        <article className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 self-stretch border-b border-stroke-200 dark:border-neutral-700 pb-3 last:border-b-0 w-full">
            <div className="flex flex-1 flex-col justify-center items-start gap-1 min-w-0 w-full sm:w-auto">
                <h3 className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-white">{title}</h3>
                <p className="text-xs text-neutral-300 dark:text-neutral-200">{description}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                {type === 'button' && (
                    <button className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors active:scale-95">
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
                            onChange={(value) => onToggle?.(id, value)}
                        />
                    </>
                )}

                {type === 'dropdown' && (
                    <select
                        className="flex items-center h-9 sm:h-8 gap-1.5 py-1.5 sm:py-1 px-3 rounded-lg border border-stroke-300 bg-white shadow-light text-xs sm:text-sm font-medium text-neutral-500 dark:text-white cursor-pointer focus:outline-none focus:border-blue-500 dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel w-full sm:w-auto min-w-[140px] [&>option]:bg-white [&>option]:dark:bg-neutral-800 [&>option]:text-neutral-500 [&>option]:dark:text-white"
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