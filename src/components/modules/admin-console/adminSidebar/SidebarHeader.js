import { CollapseSidebarIcon, SelectorIcon } from '@/components/ui/icons';

const SidebarHeader = ({ isCollapsed, onBackToNexFile, onCollapseToggle }) => (
    <div className={`flex items-center min-h-[42px] flex-shrink-0 ${isCollapsed ? 'justify-center' : 'self-stretch gap-2'}`}>
        {!isCollapsed && (
            <button
                onClick={onBackToNexFile}
                className="flex items-center text-start gap-2 hover:opacity-70 active:scale-95 transition-all flex-1"
                title="Back to NexFile"
            >
                <SelectorIcon />
                <h3 className='text-sm sm:text-base font-medium flex-1 whitespace-nowrap dark:text-white'>Back to NexFile</h3>
            </button>
        )}

        <button
            onClick={onCollapseToggle}
            className="flex items-center justify-center w-7 h-7 p-1 rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-dark-gradient hover:bg-gray-50 dark:hover:bg-neutral-800 active:scale-95 transition-all flex-shrink-0"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
            <div className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                <CollapseSidebarIcon />
            </div>
        </button>
    </div>
);

export default SidebarHeader;