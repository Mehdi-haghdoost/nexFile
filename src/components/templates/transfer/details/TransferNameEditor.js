import { useEffect, useRef, useState } from 'react';
import { RenameIcon } from '@/components/ui/icons';
import { TRANSFER_MAX_NAME_LENGTH } from '@/utils/constants/transferConstants';

const ICON_BUTTON_CLASS =
    'flex shrink-0 items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors';

const TEXT_BUTTON_CLASS =
    'shrink-0 h-9 px-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

// The transfer's name as the page heading, editable in place
const TransferNameEditor = ({ name, onRename, isRenaming = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(name);
    const inputRef = useRef(null);

    // Opening the editor selects the whole name, so typing replaces it
    useEffect(() => {
        if (isEditing) inputRef.current?.select();
    }, [isEditing]);

    const startEditing = () => {
        setDraft(name);
        setIsEditing(true);
    };

    const cancel = () => {
        setIsEditing(false);
        setDraft(name);
    };

    // Stays open when the rename fails, so nothing typed is lost
    const save = async () => {
        if (isRenaming || !draft.trim()) return;

        const saved = await onRename?.(draft);
        if (saved) setIsEditing(false);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            save();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            cancel();
        }
    };

    if (!isEditing) {
        return (
            <div className='flex items-center gap-1 min-w-0'>
                <h1 dir='auto' className='text-lg font-medium text-neutral-500 dark:text-white truncate'>
                    {name}
                </h1>
                <button
                    type='button'
                    onClick={startEditing}
                    aria-label='Rename transfer'
                    title='Rename'
                    className={ICON_BUTTON_CLASS}
                >
                    <RenameIcon size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className='flex flex-col sm:flex-row sm:items-center gap-2 w-full'>
            {/* The heading stays for screen readers while the visible name is being edited */}
            <h1 className='sr-only'>{name}</h1>

            <input
                ref={inputRef}
                type='text'
                dir='auto'
                autoComplete='off'
                value={draft}
                disabled={isRenaming}
                maxLength={TRANSFER_MAX_NAME_LENGTH}
                aria-label='Transfer name'
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                className='flex-1 min-w-0 h-9 px-3 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-neutral-900 text-sm text-neutral-500 dark:text-white outline-none focus:border-primary-500 disabled:opacity-50'
            />

            <div className='flex gap-2'>
                <button
                    type='button'
                    onClick={save}
                    disabled={isRenaming || !draft.trim()}
                    className={`${TEXT_BUTTON_CLASS} flex items-center gap-1.5 bg-primary-500 text-white hover:opacity-90`}
                >
                    {isRenaming && (
                        <span aria-hidden='true' className='w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    )}
                    Save
                </button>
                <button
                    type='button'
                    onClick={cancel}
                    disabled={isRenaming}
                    className={`${TEXT_BUTTON_CLASS} border border-stroke-300 dark:border-dark-border bg-white dark:bg-neutral-900 text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800`}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default TransferNameEditor;