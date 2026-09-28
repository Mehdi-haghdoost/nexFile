'use client';

import { useParams, useRouter } from 'next/navigation';
import { ChevronDownIcon, ChevronRightIcon, FolderIcon2 } from '@/components/ui/icons';
import { useFolders } from '@/hooks/folders/useFolders';
import useFoldersStore from '@/store/features/folders/foldersStore';

// Each level steps in a little, so the tree's depth is visible at a glance
const INDENT_STEP = 14;

const FolderTreeNode = ({ folder, depth = 0, onNavigate }) => {
    const router = useRouter();
    const params = useParams();

    const expandedFolders = useFoldersStore((state) => state.expandedFolders);
    const toggleFolder = useFoldersStore((state) => state.toggleFolder);

    const isExpanded = expandedFolders.includes(folder.id);
    const isCurrent = params?.id === folder.id;
    const hasChildren = folder.subFoldersCount > 0;

    // Children are only fetched once the branch is opened
    const { folders: children, isLoading } = useFolders(folder.id, { enabled: isExpanded });

    const handleOpen = () => {
        router.push(`/folder/${folder.id}`);
        onNavigate?.();
    };

    // The chevron expands in place; the name navigates. Two targets, two jobs
    const handleToggle = (event) => {
        event.stopPropagation();
        toggleFolder(folder.id);
    };

    return (
        <div className='w-full'>
            <div
                style={{ paddingLeft: depth * INDENT_STEP }}
                className={`flex items-center rounded-lg transition-colors ${
                    isCurrent
                        ? 'bg-purple-50 dark:bg-dark-gradient'
                        : 'hover:bg-gray-50 dark:hover:bg-dark-gradient'
                }`}
            >
                {hasChildren ? (
                    <button
                        onClick={handleToggle}
                        aria-label={isExpanded ? `Collapse ${folder.name}` : `Expand ${folder.name}`}
                        aria-expanded={isExpanded}
                        className='flex h-7 w-7 shrink-0 items-center justify-center rounded transition-colors hover:bg-gray-200 dark:hover:bg-neutral-700'
                    >
                        {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    </button>
                ) : (
                    <span className='h-7 w-7 shrink-0' />
                )}

                <button
                    onClick={handleOpen}
                    className='flex flex-1 min-w-0 items-center gap-2 py-2 pr-2 text-left'
                >
                    <FolderIcon2 />
                    <span
                        dir='auto'
                        className={`flex-1 truncate text-sm ${
                            isCurrent
                                ? 'font-medium text-blue-700 dark:text-white'
                                : 'text-gray-700 dark:text-neutral-200'
                        }`}
                    >
                        {folder.name}
                    </span>
                    <span className='shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-neutral-600 dark:text-neutral-300'>
                        {folder.filesCount}
                    </span>
                </button>
            </div>

            {isExpanded && (
                <div className='flex flex-col'>
                    {isLoading ? (
                        <div
                            style={{ paddingLeft: (depth + 1) * INDENT_STEP + 28 }}
                            className='py-2'
                        >
                            <div className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent' />
                        </div>
                    ) : (
                        children.map((child) => (
                            <FolderTreeNode
                                key={child.id}
                                folder={child}
                                depth={depth + 1}
                                onNavigate={onNavigate}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default FolderTreeNode;