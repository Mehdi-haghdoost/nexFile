import { formatBytes } from '@/utils/transfers/formatBytes';

const TransferDetailsStats = ({ transfer }) => {
    // Headline numbers a sender checks first, with a note where the definition is not obvious
    const stats = [
        { label: 'Views', value: transfer.viewCount, hint: 'Each time the page is opened' },
        { label: 'Downloads', value: transfer.downloadCount, hint: 'Each file counts once' },
        { label: 'Files', value: transfer.filesCount },
        { label: 'Total size', value: formatBytes(transfer.totalSize) },
    ];

    return (
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className='flex flex-col gap-1 p-4 rounded-xl border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'
                >
                    <span className='text-xs text-neutral-300 dark:text-neutral-400'>
                        {stat.label}
                    </span>
                    <span className='text-xl font-semibold text-neutral-500 dark:text-white'>
                        {stat.value}
                    </span>
                    {stat.hint && (
                        <span className='text-[11px] text-neutral-300 dark:text-neutral-500'>
                            {stat.hint}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TransferDetailsStats;