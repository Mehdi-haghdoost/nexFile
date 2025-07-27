import ActionButtons from './ActionButtons';
import Header from './Header';
import styles from './homeLayout.module.css';
import Sidebar from './Sidebar';

const HomeLayout = ({children}) => {
    return (
        <div className='home-container'>
            <Sidebar />
            <div className='main-area'>
                <Header />
                <ActionButtons/>
                {children}
            </div>
        </div>
    )
}

export default HomeLayout