"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import EditorToolbar from './EditorToolbar';
import ToolInputDialog from './ToolInputDialog';
import {
    EDITOR_CONTENT_SYNC_MS,
    EDITOR_INDENT,
    EDITOR_TOOL_FLASH_MS,
    EDITOR_TOOL_INPUTS,
} from '@/utils/constants/paperDocToolsConfig';
import { applyEditorTool, getListContinuation } from '@/utils/paper-doc/editorActions';

const DocumentEditor = ({ content, onContentChange, title, onTitleChange }) => {
    const [activeTool, setActiveTool] = useState(null);
    const [isToolbarOpen, setIsToolbarOpen] = useState(false);
    const [pendingTool, setPendingTool] = useState(null);

    // Content is kept locally so typing does not re-render the header and the sidebar
    const [value, setValue] = useState(content || '');

    const textareaRef = useRef(null);
    const flashTimer = useRef(null);
    const syncTimer = useRef(null);
    const pendingRange = useRef({ start: 0, end: 0 });

    // Last value handed to the parent, used to tell local edits from external ones
    const lastSyncedValue = useRef(content || '');
    const latestValue = useRef(content || '');
    const onContentChangeRef = useRef(onContentChange);

    useEffect(() => {
        onContentChangeRef.current = onContentChange;
    }, [onContentChange]);

    // Adopt the incoming content only when the change came from outside this component
    useEffect(() => {
        const next = content || '';
        if (next === lastSyncedValue.current) return;

        lastSyncedValue.current = next;
        latestValue.current = next;
        setValue(next);
    }, [content]);

    // Flush any pending content on unmount so a quick navigation never drops edits
    useEffect(() => () => {
        if (flashTimer.current) clearTimeout(flashTimer.current);

        if (syncTimer.current) {
            clearTimeout(syncTimer.current);
            if (latestValue.current !== lastSyncedValue.current) {
                lastSyncedValue.current = latestValue.current;
                onContentChangeRef.current?.(latestValue.current);
            }
        }
    }, []);

    // Updates the textarea immediately and pushes the value up on a debounce
    const commitValue = useCallback((next) => {
        latestValue.current = next;
        setValue(next);

        if (syncTimer.current) clearTimeout(syncTimer.current);

        syncTimer.current = setTimeout(() => {
            lastSyncedValue.current = latestValue.current;
            onContentChangeRef.current?.(latestValue.current);
        }, EDITOR_CONTENT_SYNC_MS);
    }, []);

    const handleContentChange = useCallback((event) => {
        commitValue(event.target.value);
    }, [commitValue]);

    // Highlights the used button for a moment so the click is visible
    const flashActiveTool = useCallback((toolId) => {
        if (flashTimer.current) clearTimeout(flashTimer.current);
        setActiveTool(toolId);
        flashTimer.current = setTimeout(() => setActiveTool(null), EDITOR_TOOL_FLASH_MS);
    }, []);

    // Applies a patch through execCommand so the browser undo stack stays intact
    const applyPatch = useCallback((patch) => {
        const textarea = textareaRef.current;
        if (!textarea || !patch) return;

        textarea.focus();
        textarea.setSelectionRange(patch.start, patch.end);

        let applied = false;
        try {
            applied = patch.text
                ? document.execCommand('insertText', false, patch.text)
                : document.execCommand('delete');
        } catch (error) {
            applied = false;
        }

        // Older engines reject execCommand, so rewrite the value by hand instead
        if (!applied) {
            const current = textarea.value;
            const next = current.slice(0, patch.start) + patch.text + current.slice(patch.end);
            textarea.value = next;
        }

        commitValue(textarea.value);
        textarea.setSelectionRange(patch.selectionStart, patch.selectionEnd);
    }, [commitValue]);

    // Runs a tool against the caret range captured before any dialog opened
    const runTool = useCallback((toolId, range, input) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const patch = applyEditorTool(toolId, {
            value: textarea.value,
            selectionStart: range.start,
            selectionEnd: range.end,
            input,
        });

        if (!patch) return;

        applyPatch(patch);
        flashActiveTool(toolId);
    }, [applyPatch, flashActiveTool]);

    const handleToolSelect = useCallback((toolId) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const range = { start: textarea.selectionStart, end: textarea.selectionEnd };
        setIsToolbarOpen(false);

        const inputConfig = EDITOR_TOOL_INPUTS[toolId];

        // Tools that need a URL park their caret range until the dialog is answered
        if (inputConfig) {
            pendingRange.current = range;
            setPendingTool({ id: toolId, config: inputConfig });
            return;
        }

        runTool(toolId, range, '');
    }, [runTool]);

    const handleDialogConfirm = useCallback((input) => {
        const tool = pendingTool;
        setPendingTool(null);
        if (tool) runTool(tool.id, pendingRange.current, input);
    }, [pendingTool, runTool]);

    const handleDialogCancel = useCallback(() => {
        setPendingTool(null);
        textareaRef.current?.focus();
    }, []);

    // Keeps Tab inside the document and continues lists on Enter
    const handleKeyDown = useCallback((event) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        if (event.key === 'Tab') {
            event.preventDefault();
            const caret = textarea.selectionStart + EDITOR_INDENT.length;
            applyPatch({
                start: textarea.selectionStart,
                end: textarea.selectionEnd,
                text: EDITOR_INDENT,
                selectionStart: caret,
                selectionEnd: caret,
            });
            return;
        }

        if (event.key === 'Enter' && !event.shiftKey && textarea.selectionStart === textarea.selectionEnd) {
            const patch = getListContinuation(textarea.value, textarea.selectionStart);
            if (!patch) return;
            event.preventDefault();
            applyPatch(patch);
        }
    }, [applyPatch]);

    return (
        <div className='flex flex-col flex-1 w-full bg-gray-50 overflow-hidden h-full'>
            {/* Editor Area */}
            <div className='flex flex-col flex-1 items-start p-8 md:p-16 lg:p-24 gap-4 bg-white self-stretch overflow-y-auto custom-scrollbar dark:bg-neutral-900 dark:border-neutral-800'>
                {/* Title is bound to the document name so the header stays in sync */}
                <input
                    type="text"
                    value={title || ''}
                    dir="auto"
                    placeholder='Give a Title'
                    onChange={(event) => onTitleChange?.(event.target.value)}
                    className='w-full bg-transparent outline-none border-none p-0 text-semibold-36 dark:text-semibold-36-neutral-300'
                />

                {/* dir auto keeps Persian paragraphs right to left without a manual switch */}
                <textarea
                    ref={textareaRef}
                    value={value}
                    dir="auto"
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    placeholder='Type something'
                    onChange={handleContentChange}
                    onKeyDown={handleKeyDown}
                    className='flex-1 w-full text-base resize-none dark:text-regular-16-neutral-300 outline-none border-none p-0 bg-transparent custom-scrollbar'
                />
            </div>

            {/* FAB - Mobile Toolbar Toggle (< 992px) */}
            <button
                onClick={() => setIsToolbarOpen(!isToolbarOpen)}
                className='lg:hidden fixed bottom-6 left-6 z-30 w-14 h-14 rounded-full bg-gradient-primary shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all'
                aria-label="Toggle toolbar"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isToolbarOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    )}
                </svg>
            </button>

            {/* Toolbar Overlay (< 992px) */}
            {isToolbarOpen && (
                <div
                    className='lg:hidden fixed inset-0 bg-black/30 z-40'
                    onClick={() => setIsToolbarOpen(false)}
                />
            )}

            {/* Toolbar - Desktop: relative bottom, Mobile: fixed left */}
            <div className='lg:flex lg:justify-center lg:items-center lg:py-3 lg:px-4 lg:bg-white lg:border-t lg:border-stroke-200 lg:dark:bg-neutral-900 lg:dark:border-neutral-800 hidden'>
                <EditorToolbar
                    onToolSelect={handleToolSelect}
                    activeTool={activeTool}
                />
            </div>

            {/* Mobile Toolbar */}
            <div className={`
                lg:hidden
                fixed left-0 top-1/2 -translate-y-1/2 z-50
                transition-transform duration-300 ease-in-out
                ${isToolbarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <EditorToolbar
                    onToolSelect={handleToolSelect}
                    activeTool={activeTool}
                />
            </div>

            {/* URL prompt for the image, video and link tools */}
            {pendingTool && (
                <ToolInputDialog
                    title={pendingTool.config.title}
                    label={pendingTool.config.label}
                    placeholder={pendingTool.config.placeholder}
                    confirmText={pendingTool.config.confirmText}
                    onConfirm={handleDialogConfirm}
                    onCancel={handleDialogCancel}
                />
            )}
        </div>
    );
};

export default DocumentEditor;