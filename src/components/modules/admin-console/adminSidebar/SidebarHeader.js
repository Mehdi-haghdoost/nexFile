import { CollapseSidebarIcon, SelectorIcon } from '@/components/ui/icons';

const SidebarHeader = ({ isCollapsed, onBackToNexFile, onCollapseToggle }) => (
    <div className={`flex items-center h-[42px] flex-shrink-0 ${isCollapsed ? 'justify-center' : 'self-stretch gap-2'}`}>
        {!isCollapsed && (
            <button
                onClick={onBackToNexFile}
                className="flex items-center text-start gap-2 hover:opacity-70 transition-opacity flex-1"
                title="Back to NexFile"
            >
                <SelectorIcon />
                <h3 className='text-medium-16 flex-1 whitespace-nowrap dark:text-medium-16-white'>Back to NexFile</h3>
            </button>
        )}

        <button
            onClick={onCollapseToggle}
            className="btn-base w-7 h-7 p-1 rounded-lg"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
            <div className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                <CollapseSidebarIcon />
            </div>
        </button>
    </div>
);

export default SidebarHeader;