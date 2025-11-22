import React, { useState, useRef } from 'react';
import { Switch } from '@/components/ui/Switch';
import { ChevronDownIcon, ChevronRightIcon } from '@/components/ui/icons';

const SecuritySettingItem = ({ setting, onToggle, onChangeOption }) => {
    const { id, title, description, type, actionText, status, options, currentOption } = setting;
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const selectRef = useRef(null);

    const handleSelectFocus = () => {
        setIsSelectOpen(true);
    };

    const handleSelectBlur = () => {
        setIsSelectOpen(false);
    };

    const handleSelectChange = (e) => {
        onChangeOption?.(id, e.target.value);

        setIsSelectOpen(false);

        selectRef.current?.blur();
    };

    const handleSelectMouseDown = (e) => {

        if (!isSelectOpen) {
            setIsSelectOpen(true);
        }
    };

    return (
        <article className="flex justify-between items-center self-stretch border-b border-stroke-200 dark:border-neutral-700 pb-3 last:border-b-0">
            <div className="flex flex-1 flex-col justify-center items-start gap-1">
                <h3 className="text-medium-14 dark:text-medium-14-white">{title}</h3>
                <p className="text-regular-12-neutral-200">{description}</p>
            </div>

            <div className="flex items-center gap-2">
                {type === 'button' && (
                    <button
                        className="text-medium-14 dark:text-medium-14-white text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        {actionText}
                    </button>
                )}

                {type === 'switch' && (
                    <>
                        <span className="text-medium-14 mr-1">{status ? 'on' : 'off'}</span>
                        <Switch
                            initialValue={status}
                            onChange={(value) => onToggle?.(id, value)}
                        />
                    </>
                )}

                {type === 'dropdown' && (
                    <div className="relative">
                        <select
                            ref={selectRef}
                            className="flex items-center h-8 gap-1.5 py-1 px-3 pr-8 rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 dark:text-medium-14-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel"
                            value={currentOption}
                            onChange={handleSelectChange}
                            onFocus={handleSelectFocus}
                            onBlur={handleSelectBlur}
                            onMouseDown={handleSelectMouseDown}
                        >
                            {options.map((option) => (
                                <option key={option} value={option} className='dark:bg-neutral-900 dark:border-dark-border'>
                                    {option}
                                </option>
                            ))}
                        </select>
                        
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            {isSelectOpen ? (
                                <ChevronRightIcon />
                            ) : (
                                <ChevronDownIcon />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
};

export default SecuritySettingItem;