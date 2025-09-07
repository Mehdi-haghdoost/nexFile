'use client';
import React from 'react';
import PdfEditorHeader from '@/components/templates/pdf-editor/PdfEditorHeader';
import PdfEditorToolbar from '@/components/templates/pdf-editor/PdfEditorToolbar';
import PdfEditorSidebar from '@/components/templates/pdf-editor/PdfEditorSidebar';
import PdfEditorMainArea from '@/components/templates/pdf-editor/PdfEditorMainArea';
import usePdfEditorStore from '@/store/pdfEditorStore';



const PdfEditorLayout = () => {
    const { activeEditingTool } = usePdfEditorStore();
    
    console.log('PdfEditorLayout - activeEditingTool:', activeEditingTool);

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-50'>
            <div className='flex flex-col w-full h-screen'>
                <PdfEditorHeader />
                <PdfEditorToolbar />

                <div className='flex flex-1'>
                    <PdfEditorSidebar />
                    <PdfEditorMainArea />
                </div>
            </div>
        </div>
    );
};

export default PdfEditorLayout;