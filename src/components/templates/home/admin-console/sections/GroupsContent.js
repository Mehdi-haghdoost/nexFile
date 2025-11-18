import GroupsHeader from "../groups/GroupsHeader";
import GroupsList from "../groups/GroupsList";


const GroupsContent = () => (
    <div className='flex flex-1 flex-col items-start gap-6 py-6 px-8 self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800 h-screen'>
        {/* Group Filter Container */}
        <div className="flex flex-1 flex-col items-start gap-5 self-stretch">
            {/* Group Header with Dark Mode */}
            <div className="flex justify-between items-center self-stretch">
                <GroupsHeader />
            </div>

            {/* Group List with Dark Mode */}
            <GroupsList />
        </div>
    </div>
);

export default GroupsContent;