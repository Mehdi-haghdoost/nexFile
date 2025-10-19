import MembersTableHeader from './MembersTableHeader';
import MemberItem from '@/components/modules/admin-console/members/MemberItem';
import { MEMBERS_MOCK_DATA } from '@/utils/constants/membersConstants';

const MembersList = () => {
    return (
        <section 
            className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200'
            aria-label="Members list"
        >
            <MembersTableHeader />
            <ul className="w-full">
                {MEMBERS_MOCK_DATA.map((member) => (
                    <MemberItem key={member.id} member={member} />
                ))}
            </ul>
        </section>
    );
};

export default MembersList;