'use client';

import { useParams, useRouter } from 'next/navigation';
import { ChevronDownIcon, ChevronRightIcon, FolderIcon2 } from '@/components/ui/icons';
import { useFolders } from '@/hooks/folders/useFolders';
import useFoldersStore from '@/store/features/folders/foldersStore';

// Each level steps in a little, added to the row's own left padding
const INDENT_STEP = 14;
const BASE_PADDING = 12;

const FolderTreeNode = ({ folder, depth = 0, onNavigate }) => {
    const router = useRouter();
    const params = useParams();

    const expandedFolders = useFoldersStore((state) => state.expandedFolders);
    const toggleFolder = useFoldersStore((state) => state.toggleFolder);

    const isExpanded = expandedFolders.includes(folder.id);
    const isActive = params?.id === folder.id;
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
            {/* Matches the home sidebar's menu rows, so the two trees feel the same */}
            <div
                style={{ paddingLeft: BASE_PADDING + depth * INDENT_STEP }}
                onClick={handleOpen}
                className={`
                    flex items-center h-[38px] py-1 pr-3 gap-2 self-stretch cursor-pointer
                    rounded-lg transition-all duration-300 ease-out
                    hover:bg-gray-50 hover:scale-[1.02] hover:shadow-light
                    active:scale-[0.98]
                    dark:hover:bg-[rgba(255,255,255,0.03)]
                    group
                    ${isActive ? 'nav-item-active' : ''}
                `}
            >
                {hasChildren ? (
                    <button
                        onClick={handleToggle}
                        aria-label={isExpanded ? `Collapse ${folder.name}` : `Expand ${folder.name}`}
                        aria-expanded={isExpanded}
                        className='flex h-4 w-4 shrink-0 items-center justify-center transition-transform duration-300 hover:scale-125'
                    >
                        {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    </button>
                ) : (
                    <span className='h-4 w-4 shrink-0' />
                )}

                <div className='flex justify-center items-center h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110'>
                    <FolderIcon2 />
                </div>

                <h3
                    dir='auto'
                    className={`
                        flex-1 min-w-0 truncate text-medium-14 transition-colors duration-300
                        ${isActive
                            ? 'dark:text-medium-14-white'
                            : 'dark:text-regular-14-neutral-200 group-hover:dark:text-white'
                        }
                    `}
                >
                    {folder.name}
                </h3>

                <span className='shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 transition-colors duration-300 dark:bg-neutral-600 dark:text-neutral-300'>
                    {folder.filesCount}
                </span>
            </div>

            {isExpanded && (
                <div className='flex flex-col animate-in fade-in-0 slide-in-from-top-1 duration-200'>
                    {isLoading ? (
                        <div
                            style={{ paddingLeft: BASE_PADDING + (depth + 1) * INDENT_STEP }}
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