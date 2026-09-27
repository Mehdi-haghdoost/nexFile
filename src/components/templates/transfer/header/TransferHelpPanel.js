// Explains the parts of a transfer that are not visible from the interface
const HELP_TOPICS = [
    {
        title: 'Links expire',
        body: 'Every transfer has an expiry date. Once it passes, the link stops working for recipients. You can extend it, or end it early, from the transfer page.',
    },
    {
        title: 'Passwords are separate',
        body: 'A password protects the download page. It is never included in the email, so send it to recipients another way.',
    },
    {
        title: 'Downloads are tracked',
        body: 'Views count each time the page is opened, downloads count each file collected. You get an email the first time someone downloads.',
    },
    {
        title: 'Files are removed after a week',
        body: 'Seven days after a transfer expires its files are deleted to free up storage. The record stays, so you can still see what you sent.',
    },
];

const TransferHelpPanel = () => {
    return (
        <div className='flex flex-col'>
            <div className='px-4 py-3 border-b border-stroke-200 dark:border-neutral-700 bg-stroke-100 dark:bg-neutral-900'>
                <h2 className='text-sm font-medium text-neutral-500 dark:text-white'>How transfers work</h2>
            </div>

            <ul className='flex max-h-[320px] flex-col overflow-y-auto custom-scrollbar'>
                {HELP_TOPICS.map((topic) => (
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

export default TransferHelpPanel;