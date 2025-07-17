import styles from './authCard.module.css';

const AuthCard = ({ children, className = '' }) => {
    return (
        <div className={`flex flex-col  rounded-[28px] bg-white ${className}`}>
            {children}
        </div>
    )
}
export default AuthCard;