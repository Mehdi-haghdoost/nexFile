"use client";
import { CalendarDateIcon, EyeOffIcon, EyeOnIcon, KeyIcon, VectorIcon } from '@/components/ui/icons'
import { Switch } from '@/components/ui/Switch'
import React, { useRef, useState } from 'react'

const ViewOnlyLinkContent = () => {

    // State برای مدیریت مقادیر فرم
    const [accessLevel, setAccessLevel] = useState('anyone');
    const [isExpirationEnabled, setIsExpirationEnabled] = useState(false);
    const [expirationDate, setExpirationDate] = useState('2025-02-04');
    const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const dateInputRef = useRef(null);

    const handleDateButtonClick = () => {
        // باز کردن انتخابگر تاریخ با کلیک روی دکمه
        dateInputRef.current.showPicker();
    };

    return (
        <div className='flex flex-col items-start gap-4 self-stretch overflow-hidden'>
            <div className='flex items-center justify-between self-stretch'>
                <h2 className='text-medium-16'>Anyone with this link has editing access</h2>
                <button className='flex items-center justify-center h-8 py-[13px] px-[14px] gap-2 rounded-lg border border-[#C94653] shadow-heavy bg-gradient-to-b from-[#E95858] to-[#B63542] text-medium-14-white'>
                    Delete link
                </button>
            </div>
            <VectorIcon />

            {/* بخش 1: Select Option برای دسترسی */}ّ
            <div className='flex items-center justify-between  self-stretch'>
                <div className='flex flex-1 flex-col items-center justify-center gap-0.5 '>
                    <p className='text-regular-14-neutral-500 self-stretch text-start'>Who can access</p>
                    <p className='text-regular-12-neutral-200 self-stretch'>Manage who can edit the file using this link</p>
                </div>
                <select
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value)}
                    className='h-9 rounded-lg border border-[#ECECEE] bg-white py-1.5 pr-3 pl-4 text-start text-medium-14 shadow-light focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                    <option value="anyone">Anyone with link</option>
                    <option value="invited">Only people invited</option>
                    <option value="team">Team members only</option>
                </select>
            </div>
            <VectorIcon />

            {/* بخش 2: انتخاب تاریخ */}
            <div className='flex items-center justify-between self-stretch'>
                <div className='flex flex-1 flex-col items-center justify-center gap-0.5 '>
                    <p className='text-regular-14-neutral-500 self-stretch text-start'>Expiration</p>
                    <p className='text-regular-12-neutral-200 self-stretch'>Deactivate this link on a designated date</p>
                </div>
                <div className='flex flex-col items-end justify-center gap-3'>
                    <Switch
                        initialValue={isExpirationEnabled} onChange={setIsExpirationEnabled}
                    />
                    {isExpirationEnabled && (
                        <>
                            <button
                                onClick={handleDateButtonClick}
                                className='flex items-center w-[160px] h-8 pl-3 pr-4 gap-2 rounded-lg border border-[#ECECEE] shadow-light bg-white'
                            >
                                <CalendarDateIcon />
                                <h3 className='text-medium-14 flex-1 text-start'>{new Date(expirationDate).toLocaleDateString('en-US')}</h3>
                            </button>
                            <input
                                type="date"
                                ref={dateInputRef}
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                                className="opacity-0 w-0 h-0 absolute" // اینپوت مخفی است
                            />
                        </>
                    )}
                </div>
            </div>
            <VectorIcon />

            {/* بخش 3: پسورد و نمایش/مخفی کردن آن */}
            <div className='flex items-center justify-between self-stretch'>
                <div className='flex flex-1 flex-col items-center justify-center gap-0.5 '>
                    <p className='text-regular-14-neutral-500 self-stretch text-start'>Password protection</p>
                    <p className='text-regular-12-neutral-200 self-stretch'>Create a password to control access to
                        <br />
                        the file via the provided link
                    </p>
                </div>
                <div className='flex flex-col items-end justify-center gap-3'>
                    <Switch initialValue={isPasswordEnabled} onChange={setIsPasswordEnabled} />
                    {isPasswordEnabled && (
                        <div className='flex items-center w-[160px] h-8 px-3 gap-2 rounded-lg border border-[#ECECEE] shadow-light bg-white'>
                            <div className="flex-shrink-0 text-gray-400">
                                <KeyIcon />
                            </div>
                            <input
                                type={isPasswordVisible ? 'text' : 'password'}
                                className='w-full flex-1 min-w-0 bg-transparent text-medium-14 outline-0'
                                placeholder='Password'
                            />
                            <button onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="flex-shrink-0 text-gray-500 hover:text-gray-800">
                                {isPasswordVisible ? <EyeOnIcon /> : <EyeOffIcon />}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <VectorIcon />

            <div className='flex items-center justify-between self-stretch'>
                <div className='flex flex-1 flex-col items-center justify-center gap-0.5 '>
                    <p className='text-regular-14-neutral-500 self-stretch text-start'>Disable downloads</p>
                    <p className='text-regular-12-neutral-200 self-stretch'>To turn off download capabilities, distribute
                        <br />
                        the link for viewing only
                    </p>
                </div>
                <div className='flex flex-col items-end justify-center gap-3'>
                    <Switch />
                </div>
            </div>

        </div>
    )
}

export default ViewOnlyLinkContent