import React, { useState } from 'react';

// کامپوننت سوییچ کوچک‌تر شده
export const Switch = ({ initialValue = false, onChange }) => {
    const [isChecked, setIsChecked] = useState(initialValue);

    const handleToggle = () => {
        const newValue = !isChecked;
        setIsChecked(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <label className="flex cursor-pointer select-none items-center">
            <div className="relative">
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleToggle}
                    className="sr-only"
                />
                {/* ابعاد پس‌زمینه کوچک‌تر شده */}
                <div
                    className={`block h-6 w-11 rounded-full transition-colors ${
                        isChecked ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                ></div>
                {/* ابعاد دایره داخلی و موقعیت آن اصلاح شده */}
                <div
                    className={`absolute left-1 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white transition-transform ${
                        isChecked ? 'translate-x-full' : ''
                    }`}
                >
                    {/* آیکون ضربدر */}
                    <span className={!isChecked ? 'block' : 'hidden'}>
                        <svg
                            className="h-3 w-3 stroke-current text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </span>

                    {/* آیکون تیک */}
                    <span className={isChecked ? 'block' : 'hidden'}>
                        <svg
                            className="h-3 w-3 stroke-current text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                            ></path>
                        </svg>
                    </span>
                </div>
            </div>
        </label>
    );
};
