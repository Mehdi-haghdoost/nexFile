import QuickActionCard from '@/components/modules/admin-console/members/QuickActionCard';
import { QUICK_ACTIONS } from '@/utils/constants/membersConstants';

const MembersActions = () => {
    return (
        <nav className='flex flex-wrap items-start gap-3 md:gap-4 self-stretch w-full' aria-label="Quick actions">
            {QUICK_ACTIONS.map((action) => (
                <QuickActionCard 
                    key={action.id}
                    icon={action.icon}
                    label={action.label}
                />
            ))}
        </nav>
    );
};

export default MembersActions;