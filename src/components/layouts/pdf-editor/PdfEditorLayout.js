"use client";

import PdfEditorHeader from '@/components/templates/pdf-editor/PdfEditorHeader';
import PdfEditorMainArea from '@/components/templates/pdf-editor/PdfEditorMainArea';
import PdfEditorSidebar from '@/components/templates/pdf-editor/PdfEditorSidebar';
import PdfEditorToolbar from '@/components/templates/pdf-editor/PdfEditorToolbar';
import React from 'react';


const PdfEditorLayout = () => {
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-50'>
            <div className='flex flex-col w-full h-screen'>
                <PdfEditorHeader />
                <PdfEditorToolbar />

                <div className='flex flex-1 '>
                    <PdfEditorSidebar />
                    <PdfEditorMainArea />
                </div>
            </div>
        </div>
    );
};

export default PdfEditorLayout;