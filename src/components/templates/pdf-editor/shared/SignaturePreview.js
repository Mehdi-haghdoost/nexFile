'use client';
import React from 'react';
import { getFontById } from '@/components/ui/signatureFonts';

// draw/upload store a base64 image string; type stores { text, fontId }.
const SignaturePreview = ({ type, data, className = '', style }) => {
    if (type === 'type') {
        const font = getFontById(data?.fontId);
        return (
            <span className={`${font?.className || ''} ${className}`} style={{ color: '#000000', ...style }}>
                {data?.text}
            </span>
        );
    }

    return (
        <img
            src={data}
            alt="Signature"
            className={`${className} object-contain`}
            style={style}
            draggable={false}
        />
    );
};

export default SignaturePreview;