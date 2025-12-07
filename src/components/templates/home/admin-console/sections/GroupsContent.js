import GroupsHeader from "../groups/GroupsHeader";
import GroupsList from "../groups/GroupsList";

const GroupsContent = () => (
    <div className='flex flex-1 flex-col items-start gap-4 md:gap-6 py-4 px-4 md:py-6 md:px-8 self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800 min-h-screen w-full'>
        {/* Group Filter Container */}
        <div className="flex flex-1 flex-col items-start gap-4 md:gap-5 self-stretch w-full">
            {/* Group Header with Dark Mode */}
            <div className="flex justify-between items-center self-stretch w-full">
                <GroupsHeader />
            </div>

            {/* Group List with Dark Mode */}
            <GroupsList />
        </div>
    </div>
);

export default GroupsContent;