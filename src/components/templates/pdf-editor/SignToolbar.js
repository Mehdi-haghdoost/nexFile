'use client';
import React from 'react';
import { LinearCloseCircle, RedoIcon, UndoIcon } from '@/components/ui/icons';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import usePdfAnnotationsStore from '@/store/features/pdf-editor/pdfAnnotationsStore';
import { ToolButton, ToolSection } from './shared/ToolbarControls';
import SignaturePickerDropdown from './SignaturePickerDropdown';

const SignToolbar = () => {
    const { setActiveEditingTool, selectedSignature } = usePdfEditorStore();
    const { history, redoStack, undo, redo } = usePdfAnnotationsStore();

    return (
        <nav className='flex flex-col sm:flex-row items-start sm:items-center justify-between self-stretch py-3 sm:py-4 px-3 sm:px-8 gap-3 sm:gap-0 border-t border-b border-l border-stroke-200 bg-white dark:bg-neutral-900 dark:border-neutral-700'>
            <div className='flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap pb-2 sm:pb-0'>
                <ToolSection hasBorder>
                    <ToolButton icon={UndoIcon} label="Undo" onClick={undo} disabled={history.length === 0} />
                    <ToolButton icon={RedoIcon} label="Redo" onClick={redo} disabled={redoStack.length === 0} />
                </ToolSection>

                <ToolSection label="Signature">
                    <SignaturePickerDropdown />
                </ToolSection>

                {selectedSignature && (
                    <span className='hidden md:inline text-xs text-neutral-300 dark:text-neutral-300 whitespace-nowrap'>
                        Click the page to place it
                    </span>
                )}
            </div>

            <button
                onClick={() => setActiveEditingTool(null)}
                className='flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors self-end sm:self-auto'
                aria-label="Close sign toolbar"
            >
                <div className='flex items-center justify-center w-4 h-4'>
                    <LinearCloseCircle />
                </div>
                <span className='text-xs sm:text-sm text-neutral-500 dark:text-white'>Close</span>
            </button>
        </nav>
    );
};

export default SignToolbar;