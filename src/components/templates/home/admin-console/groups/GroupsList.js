import GroupsTableHeader from './GroupsTableHeader';
import GroupItem from '@/components/modules/admin-console/groups/GroupItem';
import { GROUPS_MOCK_DATA } from '@/utils/constants/groupsConstants';

const GroupsList = () => {
    return (
        <section 
            className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 overflow-hidden w-full'
            aria-label="Groups list"
        >
            <GroupsTableHeader />
            <ul className="w-full">
                {GROUPS_MOCK_DATA.map((group) => (
                    <GroupItem key={group.id} group={group} />
                ))}
            </ul>
        </section>
    );
};

export default GroupsList;