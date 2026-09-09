'use client';
import React from 'react';
import { EraserIcon, SignatureGlyphIcon } from '@/components/ui/icons';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import useSignatures from '@/hooks/signatures/useSignatures';
import useModalStore from '@/store/ui/modalStore';
import SignaturePreview from '@/components/templates/pdf-editor/shared/SignaturePreview';
import ColorGrid from './ColorGrid';
import OptionPills from './OptionPills';
import {
    OPACITY_OPTIONS,
    STROKE_OPTIONS,
    FONT_SIZE_OPTIONS,
} from '@/utils/constants/pdfEditorConstants';

const MobileStyleTab = ({ onClose }) => {
    const {
        activeEditingTool,
        toolSettingsByTool,
        isEraserActive,
        selectedSignature,
        setToolColor,
        setToolOpacity,
        setToolStrokeWidth,
        setToolFontSize,
        setSelectedSignature,
        toggleEraser,
    } = usePdfEditorStore();

    const { signatures, isLoading } = useSignatures();
    const { openModal } = useModalStore();

    const isStrokeTool = activeEditingTool === 'draw' || activeEditingTool === 'highlight';
    const isTextTool = activeEditingTool === 'addText';
    const isSignTool = activeEditingTool === 'sign';

    const strokeSettings = toolSettingsByTool[activeEditingTool === 'highlight' ? 'highlight' : 'draw'];
    const textSettings = toolSettingsByTool.text;

    // Snapshotted so a placed box survives later edits to the saved signature
    const handleSelectSignature = (signature) => {
        setSelectedSignature({ type: signature.type, data: signature.data });
    };

    if (isStrokeTool) {
        return (
            <div className='flex flex-col gap-5'>
                <ColorGrid value={strokeSettings.color} onSelect={setToolColor} />
                <OptionPills
                    label='Opacity'
                    options={OPACITY_OPTIONS}
                    value={strokeSettings.opacity}
                    formatValue={(val) => `${val}%`}
                    onSelect={setToolOpacity}
                />
                <OptionPills
                    label='Stroke'
                    options={STROKE_OPTIONS}
                    value={strokeSettings.strokeWidth}
                    formatValue={(val) => `${val}pt`}
                    onSelect={setToolStrokeWidth}
                />
                <button
                    onClick={toggleEraser}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        isEraserActive
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-500'
                            : 'border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-white'
                    }`}
                >
                    <EraserIcon className='w-6 h-6' />
                    <span className='text-sm font-medium'>{isEraserActive ? 'Eraser on' : 'Eraser off'}</span>
                </button>
            </div>
        );
    }

    if (isTextTool) {
        return (
            <div className='flex flex-col gap-5'>
                <ColorGrid value={textSettings.color} onSelect={setToolColor} />
                <OptionPills
                    label='Size'
                    options={FONT_SIZE_OPTIONS}
                    value={textSettings.fontSize}
                    formatValue={(val) => `${val}px`}
                    onSelect={setToolFontSize}
                />
                <p className='text-xs text-neutral-300 dark:text-neutral-300'>
                    These apply to the next text box you add.
                </p>
            </div>
        );
    }

    if (isSignTool) {
        return (
            <div className='flex flex-col gap-3'>
                <span className='text-sm font-medium text-neutral-500 dark:text-white'>Signature</span>

                {isLoading && (
                    <p className='text-sm text-neutral-300 dark:text-neutral-300 text-center py-4'>Loading...</p>
                )}

                {!isLoading && signatures.length === 0 && (
                    <p className='text-sm text-neutral-300 dark:text-neutral-300 text-center py-4'>
                        No saved signatures yet
                    </p>
                )}

                {!isLoading && signatures.map((signature) => {
                    const isSelected = selectedSignature?.data === signature.data;
                    return (
                        <button
                            key={signature._id}
                            onClick={() => handleSelectSignature(signature)}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                                isSelected
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                    : 'border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                            }`}
                        >
                            <span className='flex items-center justify-center w-16 h-10 rounded border border-stroke-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-900 shrink-0 overflow-hidden'>
                                <SignaturePreview type={signature.type} data={signature.data} className='max-h-8 max-w-14 text-sm' />
                            </span>
                            <span className='text-sm text-neutral-500 dark:text-white truncate'>{signature.name}</span>
                        </button>
                    );
                })}

                <button
                    onClick={() => {
                        onClose();
                        openModal('createSignature');
                    }}
                    className='flex items-center justify-center gap-2 p-3 rounded-xl border border-stroke-300 dark:border-neutral-700 text-sm font-medium text-primary-500'
                >
                    <SignatureGlyphIcon />
                    Create new signature
                </button>

                {selectedSignature && (
                    <p className='text-xs text-neutral-300 dark:text-neutral-300'>
                        Close this panel and tap the page to place it.
                    </p>
                )}
            </div>
        );
    }

    return (
        <p className='text-sm text-neutral-300 dark:text-neutral-300 text-center py-8'>
            Pick a tool from Edit Tools to see its settings.
        </p>
    );
};

export default MobileStyleTab;