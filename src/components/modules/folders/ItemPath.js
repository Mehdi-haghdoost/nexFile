import { ChevronRightIcon } from '@/components/ui/icons';

// Deep paths keep only the nearest ancestors, since a result row is narrow
const MAX_VISIBLE = 2;

// Where an item sits, for anywhere it is listed away from its own level
const ItemPath = ({ path = [], rootLabel = 'All folders' }) => {
    if (!path.length) {
        return (
            <span className='text-[11px] text-neutral-300 dark:text-neutral-400'>
                {rootLabel}
            </span>
        );
    }

    const isCollapsed = path.length > MAX_VISIBLE;
    const visible = isCollapsed ? path.slice(-MAX_VISIBLE) : path;

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

export default ItemPath;