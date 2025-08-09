import styles from './dropdownWrapper.module.css';
const DropdownWrapper = ({ children, onClose, className }) => {

  const handleContentClick = (e) => {
    e.stopPropagation()
  }
  return (
    <div
      onClick={handleContentClick}
      className={`flex flex-col justify-center items-center gap-2 w-[285px] p-2 absolute top-[83px] rounded-lg border border-[#F2F2F3] bg-white ${styles.dropdown} ${styles.boxShadowDropdown} ${className || ''}`}
    >
      {children}
    </div>
  )
}

export default DropdownWrapper