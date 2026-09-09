'use client';
import React, { useState } from 'react';
import {
    EditIcon,
    HighlightIcon,
    AddTextIcon,
    SignToolIcon,
    RotateRightIcon,
    RotateLeftIcon,
    AddPageIcon,
    RedTrashIcon,
    ZoomInIcon,
    ZoomOutIcon,
    EraserIcon,
    CloseIcon,
    SignatureGlyphIcon
} from '@/components/ui/icons';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import usePdfPagesStore from '@/store/features/pdf-editor/pdfPagesStore';
import useSignatures from '@/hooks/signatures/useSignatures';
import useModalStore from '@/store/ui/modalStore';
import SignaturePreview from './shared/SignaturePreview';
import {
    ZOOM_OPTIONS,
    QUICK_COLORS,
    OPACITY_OPTIONS,
    STROKE_OPTIONS,
    FONT_SIZE_OPTIONS
} from '@/utils/constants/pdfEditorConstants';
import { isValidHexColor, normalizeHexColor } from '@/utils/pdf-editor/color';
import { showErrorToast } from '@/lib/toast';
import { showConfirmDialog } from '@/lib/sweetAlert';

const OptionPills = ({ label, options, value, formatValue, onSelect }) => (
    <div className='flex flex-col gap-2'>
        <span className='text-sm font-medium text-neutral-500 dark:text-white'>{label}</span>
        <div className='flex flex-wrap gap-2'>
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => onSelect(option)}
                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        option === value
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-neutral-800 text-neutral-500 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700'
                    }`}
                >
                    {formatValue(option)}
                </button>
            ))}
        </div>
    </div>
);

const ColorGrid = ({ value, onSelect }) => {
    const [hexDraft, setHexDraft] = useState(value);

    const handleHexChange = (next) => {
        setHexDraft(next);
        if (isValidHexColor(next)) onSelect(normalizeHexColor(next));
    };

    return (
        <div className='flex flex-col gap-2'>
            <span className='text-sm font-medium text-neutral-500 dark:text-white'>Color</span>
            <div className='grid grid-cols-5 gap-2'>
                {QUICK_COLORS.map(({ hex, swatchClass }) => (
                    <button
                        key={hex}
                        onClick={() => onSelect(hex)}
                        className={`h-10 rounded-lg border-2 transition-transform active:scale-95 ${swatchClass} ${
                            value === hex ? 'border-primary-500' : 'border-stroke-300 dark:border-neutral-600'
                        }`}
                        aria-label={`Color ${hex}`}
                    />
                ))}
            </div>
            <div className='flex items-center gap-2'>
                <input
                    type='text'
                    value={hexDraft}
                    onChange={(e) => handleHexChange(e.target.value)}
                    placeholder='#000000'
                    className='flex-1 h-10 px-3 rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm text-neutral-500 dark:text-white text-center outline-none focus:border-primary-500'
                />
                <div
                    className='w-10 h-10 rounded-lg border border-stroke-300 dark:border-neutral-600 flex-shrink-0'
                    style={{ backgroundColor: value }}
                />
            </div>
        </div>
    );
};

const MobileToolsPanel = ({ isOpen, onClose }) => {
    const {
        zoomLevel,
        activeEditingTool,
        toolSettingsByTool,
        isEraserActive,
        selectedSignature,
        setActiveEditingTool,
        setZoomLevel,
        setToolColor,
        setToolOpacity,
        setToolStrokeWidth,
        setToolFontSize,
        setSelectedSignature,
        toggleEraser,
        zoomIn,
        zoomOut
    } = usePdfEditorStore();

    const { pages, currentPage, setCurrentPage, rotatePage, addBlankPageAfter, deletePage } = usePdfPagesStore();
    const currentEntry = pages[currentPage - 1];

    const { signatures, isLoading: signaturesLoading } = useSignatures();
    const { openModal } = useModalStore();

    const [activeTab, setActiveTab] = useState('edit');

    const editTools = [
        { id: 'draw', icon: EditIcon, label: 'Draw' },
        { id: 'highlight', icon: HighlightIcon, label: 'Highlight' },
        { id: 'addText', icon: AddTextIcon, label: 'Add text' },
        { id: 'sign', icon: SignToolIcon, label: 'Sign' }
    ];

    const handleDeletePage = async () => {
        if (!currentEntry) return;

        const confirmed = await showConfirmDialog({
            title: 'Delete this page?',
            text: 'Any drawings, text, or signatures on this page will be removed too. This cannot be undone.',
            confirmButtonText: 'Yes, delete it',
        });

        if (!confirmed) return;

        const result = deletePage(currentEntry.id);
        if (!result.success) showErrorToast('A document needs at least one page');
    };

    const pageActions = [
        { id: 'rotate-right', icon: RotateRightIcon, label: 'Rotate right', action: () => currentEntry && rotatePage(currentEntry.id, 'cw') },
        { id: 'rotate-left', icon: RotateLeftIcon, label: 'Rotate left', action: () => currentEntry && rotatePage(currentEntry.id, 'ccw') },
        { id: 'add-page', icon: AddPageIcon, label: 'Add page', action: () => addBlankPageAfter(currentEntry?.id ?? null) },
        { id: 'delete-page', icon: RedTrashIcon, label: 'Delete page', action: handleDeletePage },
    ];

    const isStrokeTool = activeEditingTool === 'draw' || activeEditingTool === 'highlight';
    const isTextTool = activeEditingTool === 'addText';
    const isSignTool = activeEditingTool === 'sign';
    const strokeSettings = toolSettingsByTool[activeEditingTool === 'highlight' ? 'highlight' : 'draw'];
    const textSettings = toolSettingsByTool.text;

    const handleSelectSignature = (signature) => {
        // Snapshotted so the placed box survives later edits to the saved signature
        setSelectedSignature({ type: signature.type, data: signature.data });
    };

    const renderStyleTab = () => {
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

                    {signaturesLoading && (
                        <p className='text-sm text-neutral-300 dark:text-neutral-300 text-center py-4'>Loading...</p>
                    )}

                    {!signaturesLoading && signatures.length === 0 && (
                        <p className='text-sm text-neutral-300 dark:text-neutral-300 text-center py-4'>
                            No saved signatures yet
                        </p>
                    )}

                    {!signaturesLoading && signatures.map((signature) => {
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

    if (!isOpen) return null;

    return (
        <>
            <div
                className='lg:hidden fixed inset-0 bg-black/50 z-40'
                onClick={onClose}
            />

            <div className='lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 rounded-t-2xl shadow-2xl border-t border-stroke-300 dark:border-neutral-700 max-h-[70vh] overflow-hidden flex flex-col animate-slide-up'>
                <div className='flex justify-center py-2'>
                    <div className='w-12 h-1 bg-gray-300 dark:bg-neutral-600 rounded-full' />
                </div>

                <div className='flex items-center justify-between px-4 pb-3 border-b border-stroke-300 dark:border-neutral-700'>
                    <h3 className='text-base font-semibold text-neutral-500 dark:text-white'>Tools</h3>
                    <button
                        onClick={onClose}
                        className='p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded transition-colors'
                        aria-label="Close tools"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className='flex items-center gap-1 px-4 py-3 border-b border-stroke-300 dark:border-neutral-700 overflow-x-auto'>
                    {[
                        { id: 'edit', label: 'Edit Tools' },
                        { id: 'style', label: 'Style' },
                        { id: 'page', label: 'Page' },
                        { id: 'zoom', label: 'Zoom' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 min-w-fit py-2 px-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                                activeTab === tab.id
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 dark:bg-neutral-800 text-neutral-500 dark:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className='flex-1 overflow-y-auto p-4'>
                    {activeTab === 'edit' && (
                        <div className='grid grid-cols-2 gap-3'>
                            {editTools.map((tool) => {
                                const Icon = tool.icon;
                                return (
                                    <button
                                        key={tool.id}
                                        onClick={() => {
                                            setActiveEditingTool(tool.id);
                                            // Style follows the tool choice so settings are one tap away
                                            setActiveTab('style');
                                        }}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                                            activeEditingTool === tool.id
                                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                                : 'border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300'
                                        }`}
                                    >
                                        <Icon className={`w-8 h-8 ${
                                            activeEditingTool === tool.id
                                                ? 'text-primary-500'
                                                : 'text-neutral-500 dark:text-white'
                                        }`} />
                                        <span className={`text-sm font-medium ${
                                            activeEditingTool === tool.id
                                                ? 'text-primary-500'
                                                : 'text-neutral-500 dark:text-white'
                                        }`}>
                                            {tool.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === 'style' && renderStyleTab()}

                    {activeTab === 'page' && (
                        <div className='flex flex-col gap-4'>
                            <div className='flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-800'>
                                <span className='text-sm text-neutral-500 dark:text-white'>Current Page:</span>
                                <div className='flex items-center gap-2'>
                                    <button
                                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                        className='p-2 rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 disabled:opacity-50'
                                        disabled={currentPage === 1}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <span className='text-lg font-semibold text-neutral-500 dark:text-white min-w-[60px] text-center'>
                                        {currentPage} / {pages.length}
                                    </span>
                                    <button
                                        onClick={() => currentPage < pages.length && setCurrentPage(currentPage + 1)}
                                        className='p-2 rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 disabled:opacity-50'
                                        disabled={currentPage === pages.length}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-3'>
                                {pageActions.map((action) => {
                                    const Icon = action.icon;
                                    return (
                                        <button
                                            key={action.id}
                                            onClick={async () => {
                                                await action.action();
                                                onClose();
                                            }}
                                            className='flex flex-col items-center gap-2 p-4 rounded-xl border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300 transition-all'
                                        >
                                            <Icon className="w-8 h-8 text-neutral-500 dark:text-white" />
                                            <span className='text-sm font-medium text-neutral-500 dark:text-white text-center'>
                                                {action.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'zoom' && (
                        <div className='flex flex-col gap-4'>
                            <div className='flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-800'>
                                <span className='text-sm text-neutral-500 dark:text-white'>Current Zoom:</span>
                                <span className='text-2xl font-bold text-primary-500'>{zoomLevel}%</span>
                            </div>

                            <div className='flex items-center gap-3'>
                                <button
                                    onClick={zoomOut}
                                    className='flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300 transition-all'
                                >
                                    <ZoomOutIcon className="w-6 h-6" />
                                    <span className='text-sm font-medium'>Zoom Out</span>
                                </button>
                                <button
                                    onClick={zoomIn}
                                    className='flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300 transition-all'
                                >
                                    <ZoomInIcon className="w-6 h-6" />
                                    <span className='text-sm font-medium'>Zoom In</span>
                                </button>
                            </div>

                            <div className='grid grid-cols-4 gap-2'>
                                {ZOOM_OPTIONS.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setZoomLevel(option);
                                            onClose();
                                        }}
                                        className={`py-3 rounded-lg text-sm font-medium transition-all ${
                                            option === zoomLevel
                                                ? 'bg-primary-500 text-white'
                                                : 'bg-gray-100 dark:bg-neutral-800 text-neutral-500 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700'
                                        }`}
                                    >
                                        {option}%
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MobileToolsPanel;