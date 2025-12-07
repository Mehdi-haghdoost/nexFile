import MembersActions from '@/components/templates/home/admin-console/members/MembersActions';
import MembersHeader from '@/components/templates/home/admin-console/members/MembersHeader';
import MembersList from '@/components/templates/home/admin-console/members/MembersList';

const MembersContent = () => {
    return (
        <main className='flex flex-1 flex-col items-start gap-4 md:gap-6 py-4 px-4 md:py-6 md:px-8 self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800 min-h-screen w-full'>
            <MembersActions />
            
            <section className='flex flex-1 flex-col items-start gap-4 md:gap-5 self-stretch w-full'>
                <MembersHeader />
                <MembersList />
            </section>
        </main>
    );
};

export default MembersContent;