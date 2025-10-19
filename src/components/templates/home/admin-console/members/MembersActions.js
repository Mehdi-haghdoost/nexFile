import QuickActionCard from '@/components/modules/admin-console/members/QuickActionCard';
import { QUICK_ACTIONS } from '@/utils/constants/membersConstants';

const MembersActions = () => {
    return (
        <nav className='flex items-start gap-4 self-stretch' aria-label="Quick actions">
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