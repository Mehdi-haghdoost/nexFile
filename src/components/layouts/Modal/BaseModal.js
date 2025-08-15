import React, { useEffect, useRef } from 'react'

const BaseModal = ({ isOpen, onClose, children, width = '500px' }) => {

    const containerRef = useRef();

    // بستن مدال با کلیک بر روی محیطی خارج از مدال
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!isOpen) return;
            if (containerRef.current && containerRef.current.contains(e.target)) return;

            onClose();
        }

        // اینجا گفتم فقط زمانی که دراپ داون بازهست لیسنر اضافه کن 
        if (isOpen) {
            document.addEventListener('click', handleClickOutside)
            document.addEventListener('touchstart', handleClickOutside)  //این حالت برای موبایله
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        }
    }, [isOpen])

    // Escape key handler
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            //  اینجا وقتی مدال باز هست از اسکرول جلوگیری میکنه
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };

    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop - دودی پشت مدال */}
            <div
                className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-in fade-in-0 duration-200'
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <div
                    ref={containerRef}
                    className="flex flex-col justify-center items-start gap-12 flex-shrink-0 rounded-lg border border-[#F1F1F3] bg-white p-6 animate-in fade-in-0 zoom-in-95 duration-200"
                    style={{ width }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </>
    )
}

export default BaseModal