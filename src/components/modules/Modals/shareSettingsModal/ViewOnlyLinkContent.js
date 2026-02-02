"use client";
import { CalendarDateIcon, EyeOffIcon, EyeOnIcon, KeyIcon, VectorIcon } from '@/components/ui/icons';
import { Switch } from '@/components/ui/Switch';
import React, { useRef, useState } from 'react';

const ViewOnlyLinkContent = ({
    onLinkDeleted,
    accessLevel,
    setAccessLevel,
    isExpirationEnabled,
    setIsExpirationEnabled,
    expirationDate,
    setExpirationDate,
    isPasswordEnabled,
    setIsPasswordEnabled,
    password,
    setPassword,
    disableDownloads,
    setDisableDownloads
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const dateInputRef = useRef(null);

    const handleDateButtonClick = () => {
        // Open date picker
        dateInputRef.current.showPicker();
    };

    const handleDeleteLink = () => {
        onLinkDeleted();
    };

    return (
        <div className='flex flex-col items-start gap-4 self-stretch overflow-hidden px-1'>
            {/* Header with delete button */}
            <div className='flex items-center justify-between self-stretch'>
                <h2 className='text-medium-16 dark:text-medium-16-white'>Anyone with this link has editing access</h2>
                <button
                    onClick={handleDeleteLink}
                    className='flex items-center justify-center h-8 py-[13px] px-[14px] gap-2 rounded-lg border border-[#C94653] shadow-heavy bg-gradient-to-b from-[#E95858] to-[#B63542] text-medium-14-white hover:opacity-90 transition-opacity'
                >
                    Delete link
                </button>
            </div>
            <VectorIcon />

            {/* Access level selector */}
            <div className='flex items-center justify-between self-stretch'>
                <div className='flex flex-1 flex-col items-center justify-center gap-0.5'>
                    <p className='text-regular-14-neutral-500 self-stretch text-start'>Who can access</p>
                    <p className='text-regular-12-neutral-200 dark:text-regular-12-white self-stretch'>Manage who can edit the file using this link</p>
                </div>
                <select
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value)}
                    className='h-9 rounded-lg border border-[#ECECEE] dark:border-neutral-700 bg-white dark:bg-neutral-800 py-1.5 pr-3 pl-4 text-start text-medium-14 dark:text-medium-14-white shadow-light dark:shadow-dark-panel focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-primary-500'
                >
                    <option value="anyone">Anyone with link</option>
                    <option value="invited">Only people invited</option>
                    <option value="team">Team members only</option>
                </select>
            </div>
            <VectorIcon />

            {/* Expiration date */}
            <div className='flex items-center justify-between self-stretch'>
                <div className='flex flex-1 flex-col items-center justify-center gap-0.5'>
                    <p className='text-regular-14-neutral-500 self-stretch text-start'>Expiration</p>
                    <p className='text-regular-12-neutral-200 dark:text-regular-12-white self-stretch'>Deactivate this link on a designated date</p>
                </div>
                <div className='flex flex-col items-end justify-center gap-3'>
                    <Switch
                        initialValue={isExpirationEnabled}
                        onChange={setIsExpirationEnabled}
                    />
                    {isExpirationEnabled && (
                        <>
                            <button
                                onClick={handleDateButtonClick}
                                className='flex items-center w-[160px] h-8 pl-3 pr-4 gap-2 rounded-lg border border-[#ECECEE] dark:border-neutral-700 shadow-light dark:shadow-dark-panel bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors'
                            >
                                <CalendarDateIcon />
                                <h3 className='text-medium-14 dark:text-medium-14-white flex-1 text-start'>
                                    {expirationDate ? new Date(expirationDate).toLocaleDateString('en-US') : 'Select date'}
                                </h3>
                            </button>
                            <input
                                type="date"
                                ref={dateInputRef}
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                                className="opacity-0 w-0 h-0 absolute"
                            />
                        </>
                    )}
                </div>
            </div>
            <VectorIcon />

            {/* Password protection */}
            <div className='flex items-center justify-between self-stretch'>
                <div className='flex flex-1 flex-col items-center justify-center gap-0.5'>
                    <p className='text-regular-14-neutral-500 self-stretch text-start'>Password protection</p>
                    <p className='text-regular-12-neutral-200 dark:text-regular-12-white self-stretch'>
                        Create a password to control access to
                        <br />
                        the file via the provided link
                    </p>
                </div>
                <div className='flex flex-col items-end justify-center gap-3'>
                    <Switch
                        initialValue={isPasswordEnabled}
                        onChange={setIsPasswordEnabled}
                    />
                    {isPasswordEnabled && (
                        <div className='flex items-center w-[160px] h-8 px-3 gap-2 rounded-lg border border-[#ECECEE] dark:border-neutral-700 shadow-light dark:shadow-dark-panel bg-white dark:bg-neutral-800'>
                            <div className="flex-shrink-0 text-gray-400 dark:text-neutral-400">
                                <KeyIcon />
                            </div>
                            <input
                                type={isPasswordVisible ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='w-full flex-1 min-w-0 bg-transparent text-medium-14 dark:text-medium-14-white outline-0 placeholder:text-neutral-300 dark:placeholder:text-neutral-500'
                                placeholder='Password'
                            />
                            <button
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                className="flex-shrink-0 text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 transition-colors"
                            >
                                {isPasswordVisible ? <EyeOnIcon /> : <EyeOffIcon />}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <VectorIcon />

            {/* Disable downloads */}
            <div className='flex items-center justify-between self-stretch'>
                <div className='flex flex-1 flex-col items-center justify-center gap-0.5'>
                    <p className='text-regular-14-neutral-500 self-stretch text-start'>Disable downloads</p>
                    <p className='text-regular-12-neutral-200 dark:text-regular-12-white self-stretch'>
                        To turn off download capabilities, distribute
                        <br />
                        the link for viewing only
                    </p>
                </div>
                <div className='flex flex-col items-end justify-center gap-3'>
                    <Switch
                        initialValue={disableDownloads}
                        onChange={setDisableDownloads}
                    />
                </div>
            </div>
        </div>
    );
};

export default ViewOnlyLinkContent;