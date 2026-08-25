import PdfEditorLayout from '@/components/layouts/pdf-editor/PdfEditorLayout';
import React from 'react';

const PdfEditorPage = async ({ params }) => {
    const { fileId } = await params;

    return <PdfEditorLayout fileId={fileId} />;
};

export default PdfEditorPage;