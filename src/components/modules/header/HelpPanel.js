// Explains the parts of a section that are not visible from the interface
const HelpPanel = ({ title, topics }) => {
    return (
        <div className='flex flex-col'>
            <div className='px-4 py-3 border-b border-stroke-200 dark:border-neutral-700 bg-stroke-100 dark:bg-neutral-900'>
                <h2 className='text-sm font-medium text-neutral-500 dark:text-white'>{title}</h2>
            </div>

            <ul className='flex max-h-[320px] flex-col overflow-y-auto custom-scrollbar'>
                {topics.map((topic) => (
                    <li
                        key={topic.title}
                        className='flex flex-col gap-1 px-4 py-3 border-b border-stroke-200 dark:border-neutral-700 last:border-0'
                    >
                        <h3 className='text-xs font-medium text-neutral-500 dark:text-white'>
                            {topic.title}
                        </h3>
                        <p className='text-xs leading-relaxed text-neutral-300 dark:text-neutral-400'>
                            {topic.body}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HelpPanel;