import MembersActions from '@/components/templates/home/admin-console/members/MembersActions';
import MembersHeader from '@/components/templates/home/admin-console/members/MembersHeader';
import MembersList from '@/components/templates/home/admin-console/members/MembersList';

const MembersContent = () => {
    return (
        <main className='flex flex-1 flex-col items-start gap-6 py-6 px-8 self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800 h-screen'>
            <MembersActions />
            
            <section className='flex flex-1 flex-col items-start gap-5 self-stretch'>
                <MembersHeader />
                <MembersList />
            </section>
        </main>
    );
};

export default MembersContent;