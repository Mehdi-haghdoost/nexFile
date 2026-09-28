'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, FolderIcon2, HomeIcon } from '@/components/ui/icons';
import { useFolders } from '@/hooks/folders/useFolders';

const INDENT_STEP = 16;

// One destination in the tree, with its own expansion state
const PickerNode = ({ folder, depth, value, onChange, excludeId }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Children load only once the branch is opened
    const { folders: children, isLoading } = useFolders(folder.id, { enabled: isExpanded });

    const isSelected = value === folder.id;
    const hasChildren = folder.subFoldersCount > 0;

    return (
        <div className='w-full'>
            <div
                style={{ paddingLeft: depth * INDENT_STEP }}
                className={`flex items-center rounded-lg transition-colors ${
                    isSelected
                        ? 'bg-primary-50 dark:bg-primary-bg'
                        : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
                }`}
            >
                {hasChildren ? (
                    <button
                        type='button'
                        onClick={() => setIsExpanded((prev) => !prev)}
                        aria-label={isExpanded ? `Collapse ${folder.name}` : `Expand ${folder.name}`}
                        className='flex h-7 w-7 shrink-0 items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-neutral-700'
                    >
                        {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    </button>
                ) : (
                    <span className='h-7 w-7 shrink-0' />
                )}

                <button
                    type='button'
                    onClick={() => onChange(folder.id)}
                    className='flex flex-1 min-w-0 items-center gap-2 py-2 pr-2 text-left'
                >
                    <FolderIcon2 />
                    <span
                        dir='auto'
                        className={`flex-1 truncate text-sm ${
                            isSelected
                                ? 'font-medium text-primary-500 dark:text-white'
                                : 'text-neutral-500 dark:text-neutral-200'
                        }`}
                    >
                        {folder.name}
                    </span>
                </button>
            </div>

            {isExpanded && (
                <div className='flex flex-col'>
                    {isLoading ? (
                        <div style={{ paddingLeft: (depth + 1) * INDENT_STEP + 28 }} className='py-2'>
                            <div className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent' />
                        </div>
                    ) : (
                        children
                            .filter((child) => child.id !== excludeId)
                            .map((child) => (
                                <PickerNode
                                    key={child.id}
                                    folder={child}
                                    depth={depth + 1}
                                    value={value}
                                    onChange={onChange}
                                    excludeId={excludeId}
                                />
                            ))
                    )}
                </div>
            )}
        </div>
    );
};

// Choose any folder in the tree as a destination; value null means the root
const FolderPicker = ({ value, onChange, excludeId = null }) => {
    const { folders, isLoading } = useFolders();

    // Hiding the excluded folder hides its whole subtree, which is what an invalid destination needs
    const visible = folders.filter((folder) => folder.id !== excludeId);

    return (
        <div className='flex max-h-64 flex-col overflow-y-auto custom-scrollbar rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 p-1'>
            <button
                type='button'
                onClick={() => onChange(null)}
                className={`flex items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors ${
                    value === null
                        ? 'bg-primary-50 dark:bg-primary-bg'
                        : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
                }`}
            >
                <HomeIcon />
                <span
                    className={`text-sm ${
                        value === null
                            ? 'font-medium text-primary-500 dark:text-white'
                            : 'text-neutral-500 dark:text-neutral-200'
                    }`}
                >
                    All folders (root)
                </span>
            </button>

            {isLoading ? (
                <div className='flex justify-center py-6'>
                    <div className='h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent' />
                </div>
            ) : visible.length === 0 ? (
                <p className='px-2 py-4 text-center text-xs text-neutral-300 dark:text-neutral-400'>
                    No other folders to choose from
                </p>
            ) : (
                visible.map((folder) => (
                    <PickerNode
                        key={folder.id}
                        folder={folder}
                        depth={0}
                        value={value}
                        onChange={onChange}
                        excludeId={excludeId}
                    />
                ))
            )}
        </div>
    );
};

export default FolderPicker;