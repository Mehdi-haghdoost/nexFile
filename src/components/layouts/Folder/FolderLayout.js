import Navbar from '../Home/Navbar';
import Header from '../Home/Header';
import FolderSidebar from './FolderSidebar';

const FolderLayout = ({ children }) => {
    return (
        <div className='flex justify-center items-start w-full min-h-screen bg-white'>
            <div className='flex w-full max-w-[1440px]'>
                <div className='flex'>
                    <Navbar />
                    <FolderSidebar />
                </div>
                <div className='flex flex-1 flex-col items-start flex-shrink-0 border-t border-r border-l border-[#F2F2F3]'>
                    <Header />
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FolderLayout;