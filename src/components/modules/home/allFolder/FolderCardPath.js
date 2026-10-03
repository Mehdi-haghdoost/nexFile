import { ChevronRightIcon } from '@/components/ui/icons';

// Deep paths keep only the nearest ancestor, since a card has no room for more
const MAX_VISIBLE = 2;

const FolderCardPath = ({ path = [] }) => {
    if (!path.length) return null;

    const isCollapsed = path.length > MAX_VISIBLE;
    const visible = isCollapsed ? path.slice(-1) : path;

    return (
        <span
            title={path.map((entry) => entry.name).join(' / ')}
            className='flex items-center gap-0.5 min-w-0 text-[11px] text-neutral-300 dark:text-neutral-400'
        >
            {isCollapsed && (
                <>
                    <span>…</span>
                    <span className='shrink-0 opacity-50 scale-75'>
                        <ChevronRightIcon />
                    </span>
                </>
            )}

            {visible.map((entry, index) => (
                <span key={entry.id} className='flex items-center gap-0.5 min-w-0'>
                    {index > 0 && (
                        <span className='shrink-0 opacity-50 scale-75'>
                            <ChevronRightIcon />
                        </span>
                    )}
                    <span dir='auto' className='truncate'>{entry.name}</span>
                </span>
            ))}
        </span>
    );
};

export default FolderCardPath;