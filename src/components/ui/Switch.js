// import React from 'react';

// // Compact toggle switch component (fully controlled by the `checked` prop)
// export const Switch = ({ checked = false, onChange, id }) => {
//     const handleToggle = () => {
//         onChange?.(!checked);
//     };

//     return (
//         <label htmlFor={id} className="flex cursor-pointer select-none items-center">
//             <div className="relative">
//                 <input
//                     id={id}
//                     type="checkbox"
//                     checked={checked}
//                     onChange={handleToggle}
//                     className="sr-only"
//                 />
//                 {/* Switch track */}
//                 <div
//                     className={`block h-6 w-11 rounded-full transition-colors duration-200 ${
//                         checked
//                             ? 'bg-primary-500'
//                             : 'bg-stroke-400 dark:bg-neutral-700'
//                     }`}
//                 ></div>
//                 {/* Toggle thumb */}
//                 <div
//                     className={`absolute left-1 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-neutral-50 transition-transform duration-200 shadow-md ${
//                         checked ? 'translate-x-full' : ''
//                     }`}
//                 >
//                     {/* X icon (off state) */}
//                     <span className={!checked ? 'block' : 'hidden'}>
//                         <svg
//                             className="h-3 w-3 stroke-current text-neutral-300 dark:text-neutral-400"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             xmlns="http://www.w3.org/2000/svg"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="3"
//                                 d="M6 18L18 6M6 6l12 12"
//                             ></path>
//                         </svg>
//                     </span>

//                     {/* Check icon (on state) */}
//                     <span className={checked ? 'block' : 'hidden'}>
//                         <svg
//                             className="h-3 w-3 stroke-current text-primary-500"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             xmlns="http://www.w3.org/2000/svg"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="3"
//                                 d="M5 13l4 4L19 7"
//                             ></path>
//                         </svg>
//                     </span>
//                 </div>
//             </div>
//         </label>
//     );
// };

'use client';
import React, { useState } from 'react';

// Toggle switch that works both controlled and uncontrolled.
// Pass `checked` to control it externally; otherwise it manages its own
// state, seeded from `initialValue`/`defaultChecked`.
export const Switch = ({
    checked,
    initialValue = false,
    defaultChecked,
    onChange,
    id,
    disabled = false,
}) => {
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(
        defaultChecked ?? initialValue
    );

    const value = isControlled ? checked : internalChecked;

    const handleToggle = () => {
        if (disabled) return;

        const next = !value;
        if (!isControlled) {
            setInternalChecked(next);
        }
        onChange?.(next);
    };

    return (
        <label
            htmlFor={id}
            className={`flex select-none items-center ${
                disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
            }`}
        >
            <div className="relative">
                <input
                    id={id}
                    type="checkbox"
                    checked={value}
                    onChange={handleToggle}
                    disabled={disabled}
                    className="sr-only"
                />
                {/* Switch track */}
                <div
                    className={`block h-6 w-11 rounded-full transition-colors duration-200 ${
                        value
                            ? 'bg-primary-500'
                            : 'bg-stroke-400 dark:bg-neutral-700'
                    }`}
                ></div>
                {/* Toggle thumb */}
                <div
                    className={`absolute left-1 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-neutral-50 transition-transform duration-200 shadow-md ${
                        value ? 'translate-x-full' : ''
                    }`}
                >
                    {/* X icon (off state) */}
                    <span className={!value ? 'block' : 'hidden'}>
                        <svg
                            className="h-3 w-3 stroke-current text-neutral-300 dark:text-neutral-400"
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

                    {/* Check icon (on state) */}
                    <span className={value ? 'block' : 'hidden'}>
                        <svg
                            className="h-3 w-3 stroke-current text-primary-500"
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