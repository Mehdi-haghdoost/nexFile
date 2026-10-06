import { SortIcon } from '@/components/ui/icons';

// One sortable table heading, marking which column is in use and which way
const SortableColumn = ({ column, sortConfig, onSort }) => {
    const isActive = sortConfig?.key === column.id;
    const isSortable = column.sortable !== false && Boolean(onSort);

    return (
        <div
            onClick={isSortable ? () => onSort(column.id) : undefined}
            role={isSortable ? 'button' : undefined}
            aria-sort={isActive ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : undefined}
            className={`
                flex items-center justify-between min-h-[22px] py-0 px-3 rounded transition-colors shrink-0
                ${column.width === 'flex-1' ? 'flex-1 min-w-0' : column.width}
                ${isSortable ? 'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700' : ''}
            `}
        >
            <h3 className='text-sm text-neutral-300 dark:text-neutral-300 shrink-0'>
                {column.label}
            </h3>

            {isSortable && (
                <span
                    className={`
                        transition-transform duration-200
                        ${isActive ? 'opacity-100' : 'opacity-40'}
                        ${isActive && sortConfig.direction === 'desc' ? 'rotate-180' : ''}
                    `}
                >
                    <SortIcon />
                </span>
            )}
        </div>
    );
};

export default SortableColumn;